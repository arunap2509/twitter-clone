import serverAuth from "@/lib/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(405).end();
    }

    try {
        let userId: string;

        if (req.method === 'POST') {
            const { userId: id } = req.body;
            userId = id;
        } else {
            const { userId: id } = req.query;
            userId = id as string;
        }

        let currentUser;
        const result = await serverAuth(req, res);
        if (result instanceof Error) {
            throw new Error('not signed in')
        } else {
            currentUser = result.currentUser;
        }

        if (!userId || typeof userId !== 'string') {
            throw new Error('invalid id')
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new Error('invalid id')
        }

        let updatedFollowingIds = [...(user.followingIds || [])];

        if (req.method === 'POST') {
            updatedFollowingIds.push(userId);

            try {

                await prisma.notification.create({
                    data: {
                        body: `${currentUser.name} followed you`,
                        userId: userId
                    }
                });

                await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        hasNotification: true
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
        console.log(updatedFollowingIds)
        if (req.method === 'DELETE') {
            updatedFollowingIds = updatedFollowingIds.filter((followingId) => followingId !== userId);
        }
        console.log(updatedFollowingIds)
        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                followingIds: updatedFollowingIds
            }
        });

        return res.status(200).json(updatedUser);

    } catch (e) {
        return res.status(400).json(e);
    }
}