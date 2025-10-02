import { useManifestStore } from '../store/manifestStore';

export function useManifest() {
    const {
        manifests,
        total,
        totalPages,
        currentPage,
        setManifests,
        saveLocal,
        hydrate,
        clearManifests
    } = useManifestStore();

    return {
        manifests,
        total,
        totalPages,
        currentPage,
        setManifests,
        saveLocal,
        hydrate,
        clearManifests
    };
}
