import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const sesssion = useSession();

    return sessionStorage.data?.user;
}