import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModel from "@/hooks/useEditModel";
import useUser from "@/hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import { toast } from "react-hot-toast";
import axios from "axios";
import ImageUpload from "../ImageUpload";

const EditModel = () => {

    const { data: currentUser } = useCurrentUser();
    const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
    const editModel = useEditModel();

    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setProfileImage(currentUser?.profileImage);
        setCoverImage(currentUser?.coverImage);
        setName(currentUser?.name);
        setUsername(currentUser?.username);
        setBio(currentUser?.bio);
    }, [currentUser?.profileImage, currentUser?.coverImage, currentUser?.name, currentUser?.username, currentUser?.bio]);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);

            await axios.patch('/api/edit', {
                name,
                username,
                bio,
                profileImage,
                coverImage
            });

            mutateFetchedUser();

            toast.success('profile data is updated successfully');

            editModel.onClose();

        } catch (e) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [bio, name, username, profileImage, coverImage, mutateFetchedUser, editModel]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <ImageUpload 
                disabled={isLoading}
                value={profileImage}
                onChange={(image) => setProfileImage(image)}
                label="Upload Profile Image"
            />
            <ImageUpload 
                disabled={isLoading}
                value={coverImage}
                onChange={(image) => setCoverImage(image)}
                label="Upload Cover Image"
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
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <Input
                disabled={isLoading}
                placeholder="Bio"
                onChange={(e) => setBio(e.target.value)}
                value={bio}
            />

        </div>
    );

    return (
        <div>
            <Modal
                disabled={isLoading}
                onClose={editModel.onClose}
                onSubmit={onSubmit}
                title="Edit"
                actionLabel="Update"
                isOpen={editModel.isOpen}
                body={bodyContent}
            />
        </div>
    )
}
export default EditModel;