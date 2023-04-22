import useLoginModel from "@/hooks/useLoginModel";
import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useRegisterModel from "@/hooks/useRegisterModel";
import { signIn } from "next-auth/react";

const LoginModal = () => {

    const loginModel = useLoginModel();
    const registerModel = useRegisterModel();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onToggle = useCallback(() => {
        if (isLoading) {
            return;
        }

        loginModel.onClose();
        registerModel.onOpen();
    }, [isLoading, registerModel, loginModel]);


    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);

            await signIn('credentials', {
                email,
                password
            })

            loginModel.onClose();

        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false);
        }
    }, [loginModel, email, password])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Input
                disabled={isLoading}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <Input
                disabled={isLoading}
                placeholder="Password"
                type={'password'}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
        </div>
    );

    const footerContent = (
        <div className="text-neutral-500 text-center mt-4">
            <p>First time using twitter?
                <span onClick={onToggle} className="text-white cursor-pointer hover:underline"> Create an account</span>
            </p>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            onClose={loginModel.onClose}
            onSubmit={onSubmit}
            title="Login"
            actionLabel="SignIn"
            isOpen={loginModel.isOpen}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal;