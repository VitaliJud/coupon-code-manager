import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from "url";
import { bigcommerceClient, getSession } from '../../../../lib/auth';

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
            
            const response = await bigcommerce.delete(`/promotions/${promotionId}/codes/${codeId}`) // Update the endpoint with codeId as a query parameter
            res.status(204).json(response)
        } else {
            res.status(405).send('Method Not Allowed')
        }
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
