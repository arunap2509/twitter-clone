import serverAuth from "@/lib/serverAuth";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serverAuth(req, res) as { currentUser: User };
        return res.status(200).json(currentUser);
    } catch (e) {
        return res.status(400).end();
    }
}