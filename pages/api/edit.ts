import serverAuth from "@/lib/serverAuth";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prismadb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PATCH') {
        return res.status(400).end();
    }

    try {
        let currentUser: User;
        const response = await serverAuth(req, res);
        if (response instanceof Error) {
            return res.status(500).end();
        } else {
            currentUser = response.currentUser
        }

        const { name, username, bio, profileImage, coverImage } = req.body;
        if (!name || !username) {
            throw new Error('missing fields');
        }
        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name,
                username,
                bio,
                profileImage,
                coverImage
            }
        });

        return res.status(200).json(updatedUser);

    } catch (e) {
        res.status(500).end();
    }
}