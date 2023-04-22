import useLoginModel from "@/hooks/useLoginModel";
import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useRegisterModel from "@/hooks/useRegisterModel";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

const RegisterModal = () => {

    const loginModel = useLoginModel();
    const registerModel = useRegisterModel();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onToggle = useCallback(() => {
        if (isLoading) {
            return;
        }

        registerModel.onClose();
        loginModel.onOpen();
    }, [isLoading, registerModel, loginModel]);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);

            await axios.post('/api/register', {
                email,
                password,
                name,
                userName
            });

            toast.success("Account created");

            registerModel.onClose();

            signIn('credentials', {
                email,
                password
            });

        } catch (e) {
            console.log(e)
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [registerModel, email, password, name, userName])

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
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
            />
            <Input
                disabled={isLoading}
                placeholder="UserName"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
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
            <p>Already have an account?
                <span onClick={onToggle} className="text-white cursor-pointer hover:underline"> SignIn</span>
            </p>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            onClose={registerModel.onClose}
            onSubmit={onSubmit}
            title="Create an account"
            actionLabel="Register"
            isOpen={registerModel.isOpen}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal;