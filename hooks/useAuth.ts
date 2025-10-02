import { useAuthStore } from '../store/authStore';

export function useAuth() {
    const { token, user, isAuthenticated, setAuth, logout, hydrate } = useAuthStore();
    return { token, user, isAuthenticated, setAuth, logout, hydrate };
}
