import { useLocalSearchParams, useRouter } from "expo-router";
import { Dimensions, View, Text, TouchableOpacity } from "react-native"
import { useToast } from "react-native-toast-notifications";
import { useDiligenciarForm } from "../../../hooks/useDiligenciarForm";
import { useAuth } from "../../../hooks/useAuth";
import { useNetworkStatus } from "../../../hooks/useNetworkStatus";
import { useQuery } from "@tanstack/react-query";
import { getManifestById } from "../../../services/manifestService";
import { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";
import SelectCliente from "../../../components/diligenciar/SelectCliente";
import SelectCar from "../../../components/diligenciar/SelectCar";
import UbicacionInput from "../../../components/diligenciar/UbicacionInput";
import FechaInput from "../../../components/diligenciar/FechaInput";
import SelectTemplate from "../../../components/diligenciar/SelectTemplate";
import FotosInput from "../../../components/diligenciar/FotosInput";
import ObservacionesInput from "../../../components/diligenciar/ObservacionesInput";
import Firmas from "../../../components/diligenciar/Firmas";
import { parseDate } from "../../../utils/transformData";
import { ItemCantidad } from "../../../types/manifestType";


function view() {
    const isTablet = Dimensions.get('window').width >= 768;
    const toast = useToast()
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { manifestLocales, cars, clientes, items, templates, } = useDiligenciarForm();
    const { user } = useAuth();
    const { isConnected, isInternetReachable } = useNetworkStatus();

    // Solo ejecutar la query si id está disponible y hay conexión
    const { 
        data: manifest, 
        isLoading, 
        error, 
        isError 
    } = useQuery({
        queryKey: ['manifest', id],
        queryFn: () => getManifestById({ manifestId: id as string }),
        enabled: !!(id && isConnected && isInternetReachable),
        retry: 2,
        retryDelay: 1000,
    });

    // Transformar manifestItems al formato esperado por SelectTemplate
    const transformedItems: ItemCantidad[] = useMemo(() => {
        if (!manifest?.manifestItems) return [];

        return manifest.manifestItems.map(manifestItem => ({
            itemId: manifestItem.item.id,
            cantidad: parseFloat(manifestItem.cantidad) || 0,
            volDesechos: manifestItem.volDesechos ? parseFloat(manifestItem.volDesechos) : undefined,
            nViajes: manifestItem.nViajes || undefined,
            nHoras: manifestItem.nHoras ? parseFloat(manifestItem.nHoras) : undefined,
            // Campos adicionales para productos control de plagas
            dosis: manifestItem.dosis ? parseFloat(manifestItem.dosis) : undefined,
            ubicacion: manifestItem.ubicacion || '',
            lote: manifestItem.lote || '',
            dateVencimiento: manifestItem.dateVencimiento || '',
        }));
    }, [manifest?.manifestItems]);

    const handleGoToBack = () => {
        router.back();
    }

    // Manejar errores con useEffect o directamente en el render
    if (isError && error) {
        console.error('Error al cargar el manifiesto:', error);
        toast.show(
            error instanceof Error ? error.message : 'Error al cargar el manifiesto',
            { type: 'error', placement: 'top' }
        );
    }

    // Manejar estados de carga y errores
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>Cargando manifiesto...</Text>
            </View>
        );
    }

    if (isError || !manifest) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 16, color: '#dc2626', textAlign: 'center' }}>
                    {error instanceof Error ? error.message : 'No se pudo cargar el manifiesto'}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                    Verifica tu conexión a internet e intenta nuevamente
                </Text>
            </View>
        );
    }

    if (!id) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 16, color: '#dc2626' }}>ID de manifiesto no válido</Text>
            </View>
        );
    }
    
    return (
        <View style={{ flex: 1, backgroundColor: '#fff', width: '100%' }}>
            <ScrollView style={{ flex: 1, padding: isTablet ? 48 : 16, alignSelf: 'center', width: isTablet ? 600 : '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: isTablet ? 1 : 16,  }}>
                    <TouchableOpacity
                        onPress={handleGoToBack}
                        activeOpacity={0.85}
                        style={{
                            backgroundColor: '#2563eb',
                            paddingVertical: isTablet ? 16 : 12,
                            paddingHorizontal: isTablet ? 32 : 18,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginBottom: 24,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.12,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: isTablet ? 20 : 16, letterSpacing: 0.5 }}>Regresar</Text>
                    </TouchableOpacity>
                </View>

                {   !manifest && 
                    <Text style={{ textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 16 }}>Manifiesto no encontrado</Text>
                }

                <SelectCliente clienteId={manifest?.cliente.id} readOnly />
                <SelectCar plateId={manifest?.car.id} readOnly />

                {/* Ubicación solo lectura reutilizable */}
                <UbicacionInput
                    value={manifest?.location || 'Sin ubicación'}
                    isTablet={isTablet}
                    readOnly
                />

                 {/* Fechas */}
                <FechaInput
                    date={parseDate(manifest?.date)} 
                    dateFinal={parseDate(manifest?.dateFinal)} 
                    readOnly
                />

                {/* Plantilla de items solo lectura */}
                <SelectTemplate
                    readOnly
                    templateId={manifest?.manifestTemplate.id ?? undefined}
                    items={transformedItems}
                />

                {/* Fotos solo lectura */}
                <FotosInput
                    photos={manifest?.photos} 
                    readOnly
                />

                <ObservacionesInput
                    value={manifest?.observations || 'Sin observaciones'}
                    readOnly
                    isTablet={isTablet}
                />

                <Firmas
                    userName={manifest?.user.name || ''}
                    userRole={manifest?.user.rol.name || ''}
                    signature={manifest?.signature || ''}
                    signatureClient={manifest?.signatureClient || ''}
                    phone={manifest?.phone || ''}
                    contactClient={manifest?.contactClient || ''}
                    positionClient={manifest?.positionClient || ''}
                    readOnly
                />
            </ScrollView>
        </View> 
    )
}

export default view
