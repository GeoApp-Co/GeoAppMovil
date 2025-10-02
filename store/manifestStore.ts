import { create } from 'zustand';
import { getItem, saveItem, getParsedItem, removeItem } from '../utils/storage';
import { manifestPreviewSchema, paginationManifestSchema } from '../schema/manifestSchema';
import { ManifestPreviewType } from '../types/manifestType';

export interface ManifestState {
    manifests: ManifestPreviewType[];
    total: number;
    totalPages: number;
    currentPage: number;
    setManifests: (data: ManifestPreviewType[], total: number, totalPages: number, currentPage: number) => void;
    saveLocal: () => Promise<void>;
    hydrate: () => Promise<void>;
    clearManifests: () => void;
}

export const useManifestStore = create<ManifestState>((set) => ({
    manifests: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    setManifests: (data, total, totalPages, currentPage) => {
        set({ manifests: data, total, totalPages, currentPage });
    },
    saveLocal: async () => {
        // Obtener el estado actual del store
        const currentState = {
            manifests: [],
            total: 0,
            totalPages: 0,
            currentPage: 1,
        };

        set((state) => {
            // Parsear cada manifiesto con manifestPreviewSchema
            const parsedManifests = state.manifests.map((m) => {
                const result = manifestPreviewSchema.safeParse(m);
                return result.success ? result.data : null;
            }).filter(Boolean);

            saveItem('MANIFESTS_STATE', JSON.stringify({
                manifests: parsedManifests,
                total: state.total,
                totalPages: state.totalPages,
                currentPage: state.currentPage,
            }));

            return {};
        });
    },
    hydrate: async () => {
        const local = await getItem('MANIFESTS_STATE');
        if (local) {
            try {
                const parsed = JSON.parse(local);
                const result = paginationManifestSchema.safeParse(parsed);
                if (result.success) {
                    set({
                        manifests: result.data.manifests,
                        total: result.data.total,
                        totalPages: result.data.totalPages,
                        currentPage: result.data.currentPage,
                    });
                }
            } catch {
                // Si falla, no hidrata nada
            }
        }
    },
    clearManifests: () => {
        removeItem('MANIFESTS_STATE');
        set({ manifests: [], total: 0, totalPages: 0, currentPage: 1 });
    },
}));

