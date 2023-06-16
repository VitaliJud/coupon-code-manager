import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from "url";
import { bigcommerceClient, getSession } from '../../../../lib/auth';
import { pino } from 'pino'

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: { destination: 1 }
    }
})

export default async function codes(req: NextApiRequest, res: NextApiResponse) {
    const {
        method,
        query: { promotionId, limit, page, codeId }, 
        body
    } = req;
    try {
        if (method === 'GET') {
            const { accessToken, storeHash } = await getSession(req);
            const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v3');

            const params = new URLSearchParams({ page, limit });
            const response = await bigcommerce.get(`/promotions/${promotionId}/codes?${params}`)
            res.status(200).json(response)
        } else if (method === 'POST') {
            const { accessToken, storeHash } = await getSession(req);
            const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v3');
            
            const response = await bigcommerce.post(`/promotions/${promotionId}/codes`, body)
            res.status(201).json(response)
        } else if (method === 'DELETE') {
            const { accessToken, storeHash } = await getSession(req);
            const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v3');
            
            logger.info(`Code ID: ${codeId}`)
            
            const deleteEndpoint = `/promotions/${promotionId}/codes?id:in=${codeId}`
            logger.info(`Current URL: ${deleteEndpoint}`)
            
            const response = await bigcommerce.delete(deleteEndpoint)
            res.status(204).json(response)
            
        } else {
            res.status(405).send('Method Not Allowed')
        }
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
