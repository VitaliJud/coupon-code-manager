import { NextApiRequest, NextApiResponse } from "next";
import pino from 'pino';
import { URLSearchParams } from "url";
import { bigcommerceClient, getSession } from "@lib/auth";
import { PromotionRedemptionType } from "@types";

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
            const { page, limit, sort, direction, code, name, search } = req.query;

            const baseParams: any = {
                page,
                limit,
                ...(sort && { sort, direction }),
            };

            const searchTerm = (search || code || name) as string | undefined;

            if (searchTerm) {
                const codeParams = new URLSearchParams({ ...baseParams, code: searchTerm }).toString();
                let response = await bigcommerce.get(`/promotions?${codeParams}`);

                if (!response.data?.length) {
                    const nameParams = new URLSearchParams({ ...baseParams, 'name:like': searchTerm }).toString();
                    response = await bigcommerce.get(`/promotions?${nameParams}`);
                }

                return res.status(200).json(response);
            }

            const params = new URLSearchParams({
                ...baseParams,
                redemption_type: PromotionRedemptionType.coupon,
            }).toString();

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