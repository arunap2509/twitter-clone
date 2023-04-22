import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';


const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.email) {
        return new Error("Not signed in");
    }

    const currentUser = await prisma?.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    if (!currentUser) {
        return new Error("Not signed in");
    }

    return { currentUser };
}

export default serverAuth;