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
            const { page, limit, sort, direction, code } = req.query;

            // Construct the query parameters
            const queryParams: any = {
                page,
                limit,
                ...(sort && { sort, direction }),
            };

            // If code is provided, use it for searching
            if (code) {
                queryParams.code = code;
            } else {
                // If no code is provided, default to coupon type
                queryParams.redemption_type = PromotionRedemptionType.coupon;
            }

            const params = new URLSearchParams(queryParams).toString();

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