import serverAuth from "@/lib/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prismadb';
import { User } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(405).end();
    }

    try {
        let postId: string;

        if (req.method === 'POST') {
            const { postId: id } = req.body;
            postId = id;
        } else {
            const { postId: id } = req.query;
            postId = id as string;
        }

        let currentUser: User;
        const result = await serverAuth(req, res);
        if (result instanceof Error) {
            return res.status(400).end();
        } else {
            currentUser = result.currentUser;
        }

        if (!postId || typeof postId !== 'string') {
            return res.status(500).end();
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if (!post) {
            throw new Error('invalid id');
        }

        let likes = [...(post?.likedIds) || []];

        if (req.method === 'POST') {
            likes.push(currentUser.id);

            try {
                const post = await prisma.post.findUnique({
                    where: {
                        id: postId
                    }
                });

                if (post?.userId) {
                    await prisma.notification.create({
                        data: {
                            body: `${currentUser.name} liked your post`,
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
        }

        if (req.method === 'DELETE') {
            likes = likes.filter(x => x !== currentUser.id);
        }

        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                likedIds: likes
            }
        });

        return res.status(200).end();

    } catch (e) {
        return res.status(400).json(e);
    }
}