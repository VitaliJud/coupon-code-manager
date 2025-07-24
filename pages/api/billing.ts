import { NextApiRequest, NextApiResponse } from 'next';
import pino from 'pino';
import { getSession } from '../../lib/auth';

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: { destination: 1 },
    },
});

export default async function billing(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const {
        ACCOUNT_ACCESS_TOKEN,
        MERCHANT_ACCOUNT_UUID,
        APPLICATION_ID,
        BILLING_API_URL = 'https://accounts.bigcommerce.com/graphql',
    } = process.env;

    if (!ACCOUNT_ACCESS_TOKEN || !MERCHANT_ACCOUNT_UUID || !APPLICATION_ID) {
        logger.error('Missing billing environment variables');
        res.status(500).json({ message: 'Billing configuration is incomplete.' });
        return;
    }

    try {
        const { storeHash } = await getSession(req);

        const query = `mutation ($checkout: CreateCheckoutInput!) {\n  checkout {\n    createCheckout(input: $checkout) {\n      checkout {\n        id\n        accountId\n        status\n        checkoutUrl\n      }\n    }\n  }\n}`;

        const variables = {
            checkout: {
                accountId: `bc/account/account/${MERCHANT_ACCOUNT_UUID}`,
                items: [
                    {
                        product: {
                            type: 'APPLICATION',
                            id: `bc/account/product/${APPLICATION_ID}`,
                            productLevel: 'Standard Plan',
                        },
                        scope: {
                            type: 'STORE',
                            id: `bc/account/scope/${storeHash}`,
                        },
                        description: 'Coupon Code Manager App',
                        pricingPlan: {
                            interval: 'MONTH',
                            price: { value: 0.0, currencyCode: 'USD' },
                        },
                        redirectUrl: `https://store-${storeHash}.mybigcommerce.com/manage/app/${APPLICATION_ID}/upgrade_success`,
                    },
                ],
            },
        };

        const response = await fetch(BILLING_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ACCOUNT_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        const result = await response.json();
        const checkoutUrl = result?.data?.checkout?.createCheckout?.checkout?.checkoutUrl;
        res.status(200).json({ checkoutUrl });
    } catch (error) {
        logger.error(`Billing error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}
