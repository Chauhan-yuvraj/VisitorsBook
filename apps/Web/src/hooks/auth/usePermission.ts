import { useAppSelector } from "@/store/hooks"

export const usePermission = () => {

    const { permissions, user, isAuthenticated, role } = useAppSelector((state) => state.auth);

    const hasPermission = (requiredPermission: string): boolean => {

        if (!isAuthenticated) {
            return false;
        }

        if (role === 'all' || (permissions && permissions.includes('all'))) {
            return true;
        }

        return permissions ? permissions.includes(requiredPermission) : false;
    };
    return { hasPermission, user, isAuthenticated, };
};
