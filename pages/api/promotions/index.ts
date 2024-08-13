import { NextApiRequest, NextApiResponse } from "next";
import { URLSearchParams } from "url";
import { bigcommerceClient, getSession } from "@lib/auth";
import { PromotionRedemptionType } from "@types";
import pino from 'pino';

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: { destination: 1 }
    }
});

export default async function promotions(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    if (method === 'GET') {
        try {
            const { accessToken, storeHash } = await getSession(req);
            const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v3');
            const { page, limit, sort, direction, code } = req.query;
            const params = new URLSearchParams({ page, limit, ...(sort && { sort, direction }), redemption_type: PromotionRedemptionType.coupon, ...(code && { code }) }).toString();

            logger.info(`Request parameters: ${params}`);

            const response = await bigcommerce.get(`/promotions?${params}`);
            res.status(200).json(response);
        } catch (error) {
            const { message, response } = error;
            logger.error(`Error fetching promotions: ${message}`);
            res.status(response?.status || 500).json({ message });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}