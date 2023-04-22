import serverAuth from "@/lib/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prismadb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        let currentUser;
        const result = await serverAuth(req, res);
        if (result instanceof Error) {
            throw new Error('not signed in')
        } else {
            currentUser = result.currentUser;
        }

        const { body } = req.body;
        const { postId } = req.query;

        if (!postId || typeof postId !== 'string') {
            throw new Error('invalid id');
        }

        const comment = await prisma?.comment.create({
            data: {
                body,
                userId: currentUser?.id,
                postId
            }
        });

        try {
            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            });

            if (post?.userId) {
                await prisma.notification.create({
                    data: {
                        body: `${currentUser.name} commented your post`,
                        userId: post.userId
                    }
                });

                await prisma.user.update({
                    where: {
                        id: post.userId
                    },
                    data: {
                        hasNotification: true
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }

        return res.status(200).json(comment);

    } catch (e) {
        return res.status(500).end();
    }
}