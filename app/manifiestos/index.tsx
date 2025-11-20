import { useQuery } from '@tanstack/react-query'
import React, { use, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { getManifest } from '../../services/manifestService'
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useManifest } from '../../hooks/useManifest';
import ManifestList from '../../components/ManifestList';
import { useAuth } from '../../hooks/useAuth';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';

function index() {

    const { isConnected, isInternetReachable } = useNetworkStatus();
    const { user } = useAuth()
    const { setManifests, saveLocal, manifests, total, totalPages, currentPage, hydrate } = useManifest();
    const { refreshManifestLocales, refreshCars, refreshTemplates, refreshClientes} = useDiligenciarForm();

    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(20);

    const { data, isLoading, refetch} = useQuery({
        queryKey: ['manifests', page, pageSize],
        queryFn: () => getManifest({ page, limit: pageSize }),
        refetchOnWindowFocus: false,
        enabled: isConnected && isInternetReachable && !!user,
    });
    
    

    useEffect(() => {
        if (data) {
            setManifests(data.manifests, data.total, data.totalPages, data.currentPage);
            saveLocal();
        }
    }, [data]);

    useEffect(() => {
        hydrate()
        refreshManifestLocales()
        refreshCars()
        refreshTemplates()
        refreshClientes()

    }, [])
    
    return (
        <View style={{ flex: 1 }} className="w-full min-h-screen px-2 py-4 pt-16 md:px-12 md:py-8 md:pt-20">
            <Text className="mb-4 text-2xl font-extrabold text-center md:text-4xl text-azul">Lista de Servicios/Manifiestos</Text>

            {/* Botón de actualización solo si hay internet */}
            {isConnected && isInternetReachable && (
                <View className="flex items-center mb-4">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: (!user || isLoading) ? '#a7f3d0' : '#22c55e',
                            paddingVertical: 12,
                            paddingHorizontal: 32,
                            borderRadius: 10,
                            alignItems: 'center',
                            opacity: (!user || isLoading) ? 0.6 : 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.12,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                        onPress={() => {
                            if (!user || isLoading) return;
                            hydrate();
                            refetch();
                        }}
                        disabled={isLoading}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 }}>
                            {isLoading ? 'Actualizando...' : 'Actualizar'}
                        </Text>
                    </TouchableOpacity>
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
