import useCurrentUser from './useCurrentUser';
import usePost from './usePost';
import usePosts from './usePosts';
import useLoginModel from './useLoginModel';
import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useLike = (postId: string, userId?: string) => {

    const { data: currentUser } = useCurrentUser();
    const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
    const { mutate: mutateFetchedPosts } = usePosts(userId);

    const loginModel = useLoginModel();

    const hasLiked = useMemo(() => {
        const list = fetchedPost?.likedIds || [];

        return list.includes(currentUser?.id);
    }, [fetchedPost?.likedIds, currentUser?.id]);

    const toggleLike = useCallback(async () => {
        if (!currentUser) {
            loginModel.onOpen();
            return;
        }

        try {
            let request;
            let showUnliked: boolean = false;
            if (hasLiked) {
                showUnliked = true;
                request = () => axios.delete(`/api/likes?postId=${postId}`);
            } else {
                request = () => axios.post(`/api/likes`, { postId });
            }

            await request();

            mutateFetchedPost();
            mutateFetchedPosts();

            toast.success(showUnliked ? 'UnLiked' : 'Liked');
        } catch (e) {
            toast.error('Something went wrong');
        }

    }, [currentUser, loginModel, hasLiked, postId, mutateFetchedPost, mutateFetchedPosts]);

    return {
        hasLiked,
        toggleLike
    };
}

export default useLike;