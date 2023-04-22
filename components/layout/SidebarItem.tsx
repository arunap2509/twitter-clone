import useCurrentUser from "@/hooks/useCurrentUser"
import useLoginModel from "@/hooks/useLoginModel"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { IconType } from "react-icons"
import { BsDot } from "react-icons/bs"



interface SidebarItemProps {
    onClick?: () => void
    href?: string
    label: string
    icon: IconType
    auth?: boolean
    alert?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    onClick,
    href,
    label,
    icon: Icon,
    auth,
    alert
}) => {

    const loginModel = useLoginModel();
    const router = useRouter();
    const { data: currentUser } = useCurrentUser();

    const handleClick = useCallback(() => {
        if (onClick) {
            onClick();
        }

        if (auth && !currentUser) {
            loginModel.onOpen()
        } else if (href) {
            router.push(href);
        }

    }, [onClick, router, href, auth, currentUser, loginModel])

    return (
        <div
            onClick={handleClick}
            className="flex flex-row items-center">
            <div className="
                relative
                rounded-full
                h-14
                w-14
                p-4
                flex
                items-center
                justify-center
                hover:bg-slate-300
                hover:bg-opacity-10
                cursor-pointer
                lg:hidden
            ">
                <Icon size={28} color="white" />
                {alert ? <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} /> : null}
            </div>

            <div className="
                relative
                hidden
                lg:flex
                items-center
                gap-4
                p-4
                rounded-full
                hover:bg-slate-300
                hover:bg-opacity-10
                cursor-pointer
            ">
                <Icon size={24} color="white" />
                {alert ? <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} /> : null}
                <p className="hidden lg:block text-white text-xl">{label}</p>
            </div>
        </div>
    )
}

export default SidebarItem;