
import { create } from 'zustand';
import { userSchema } from '../schema/userSchema';
import { UserType } from '../types/userType';
import { getItem, getParsedItem, removeItem } from '../utils/storage';

interface AuthState {
    token: string | null;
    user: UserType | null;
    isAuthenticated: boolean;
    setToken: (token: string | null) => void;
    setAuth: () => void;
    logout: () => void;
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    setToken: (token) => set({ token }),
    setAuth: async () => {
        const token = await getItem('AUTH_TOKEN');
        const user = await getParsedItem<UserType>('USER', userSchema);
        set({ token, user, isAuthenticated: true });
    },
    logout: () => {
        removeItem('AUTH_TOKEN');
        removeItem('USER');
        set({ token: null, user: null, isAuthenticated: false });
    },
    hydrate: async () => {
        const token = await getItem('AUTH_TOKEN');
        const user = await getParsedItem<UserType>('USER', userSchema);
        set({ token, user, isAuthenticated: !!token });
    },
}));
