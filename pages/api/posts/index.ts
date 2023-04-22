import serverAuth from "@/lib/serverAuth";
import { Post, User } from "@prisma/client";
import prisma from '@/lib/prismadb';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(400).end();
    }

    const result = await serverAuth(req, res);
    let currentUser: User;
    if (result instanceof Error) {
        return res.status(500).end();
    } else {
        currentUser = result.currentUser;
    }

    try {
        if (req.method === 'POST') {
            const { body } = req.body;

            const post = await prisma.post.create({
                data: {
                    body,
                    userId: currentUser.id
                }
            });

            return res.status(200).json(post);
        }

        if (req.method === 'GET') {
            const { userId } = req.query;
            let posts: Post[]

            if (userId && typeof userId === 'string') {
                posts = await prisma.post.findMany({
                    where: {
                        userId: userId
                    },
                    include: {
                        user: true,
                        comments: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                posts = await prisma.post.findMany({
                    include: {
                        user: true,
                        comments: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
            return res.status(200).json(posts);
        }
    } catch (e) {
        res.status(500).end();
    }
}