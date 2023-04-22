import useUser from "@/hooks/useUser";
import Image from "next/image";
import Avatar from "../Avatar";

interface UserHeroProps {
    userId: string;
}

const UserHero = ({ userId }: UserHeroProps) => {

    const { data: fetchedUser } = useUser(userId);

    return (
        <div>
            <div className="bg-neutral-500 h-44 relative">
                {fetchedUser?.coverImage && (
                    <Image
                        src={fetchedUser.coverImage}
                        fill
                        alt="Cover Image"
                        style={{ objectFit: 'cover' }}
                    />
                )}
                <div className="absolute -bottom-16 left-4">
                    <Avatar hasBorder isLarge userId={userId} />
                </div>
            </div>
        </div>
    )
}
export default UserHero;