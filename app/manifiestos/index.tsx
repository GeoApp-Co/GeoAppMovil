import { useQuery } from '@tanstack/react-query'
import React, { use, useEffect } from 'react'
import { Text, View } from 'react-native'
import { getManifest } from '../../services/manifestService'
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useManifest } from '../../hooks/useManifest';
import ManifestList from '../../components/ManifestList';

function index() {

    const { isConnected, isInternetReachable } = useNetworkStatus();
    const { setManifests, saveLocal, manifests, total, totalPages, currentPage, hydrate } = useManifest();

    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(20);

    const { data, isLoading, refetch} = useQuery({
        queryKey: ['manifests', page, pageSize],
        queryFn: () => getManifest({ page, limit: pageSize }),
        refetchOnWindowFocus: false,
        enabled: isConnected && isInternetReachable,
    });
    

    useEffect(() => {
        if (data) {
            setManifests(data.manifests, data.total, data.totalPages, data.currentPage);
            saveLocal();
        }
    }, [data]);

    useEffect(() => {
        hydrate()
    }, [])
    
    return (
        <View style={{ flex: 1 }} className="w-full min-h-screen px-2 py-4 mt-10 md:px-12 md:py-8">
            <Text className="mb-4 text-2xl font-extrabold text-center md:text-4xl text-azul">Lista de Servicios/Manifiestos</Text>

            {/* Botón de actualización solo si hay internet */}
            {isConnected && isInternetReachable && (
                <View className="flex items-center mb-4">
                    <Text
                        className="px-6 py-2 font-bold text-white rounded-lg bg-verde"
                        style={{ textAlign: 'center' }}
                        onPress={() => {
                            // Refresca la query actual
                            hydrate();
                            refetch()
                        }}
                    >Actualizar</Text>
                </View>
            )}

            {isLoading && <Text className="mt-10 font-semibold text-center text-verde">Cargando...</Text>}
            {!isLoading && manifests.length === 0 && <Text className="mt-4 font-bold text-center text-azul">No hay manifiestos disponibles.</Text>}
            {!isLoading && manifests.length > 0 && (
                <ManifestList 
                    manifests={manifests}
                />
            )}
        </View>
    );
}

export default index
