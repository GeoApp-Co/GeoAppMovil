import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDiligenciarForm } from '../../../../hooks/useDiligenciarForm';
import { useDiligenciarFormStore } from '../../../../store/diligenciarFormStore';
import SelectCliente from '../../../../components/diligenciar/SelectCliente';
import SelectCar from '../../../../components/diligenciar/SelectCar';
import FechaInput from '../../../../components/diligenciar/FechaInput';
import FotosInput from '../../../../components/diligenciar/FotosInput';
import UbicacionInput from '../../../../components/diligenciar/UbicacionInput';
import ObservacionesInput from '../../../../components/diligenciar/ObservacionesInput';
import Firmas from '../../../../components/diligenciar/Firmas';
import { useAuth } from '../../../../hooks/useAuth';
import SelectTemplate from '../../../../components/diligenciar/SelectTemplate';
import { useMutation } from '@tanstack/react-query';
import { createManifest } from '../../../../services/manifestService';
import uploadImagesToCloudinary from '../../../../services/cloudinaryService';
import { useToast } from 'react-native-toast-notifications';
import { NewManifestFormType } from '../../../../types/manifestType';
import { Alert } from 'react-native';
import { useNetworkStatus } from '../../../../hooks/useNetworkStatus';

function Index() {
    const isTablet = Dimensions.get('window').width >= 768;
    const toast = useToast()
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { manifestLocales, cars, clientes, items, templates, } = useDiligenciarForm();
    const { user } = useAuth();
    const { isConnected, isInternetReachable } = useNetworkStatus()

    const manifest = manifestLocales.find(m => m.id === id);

    const handleGoToBack = () => {
        router.back();
    }

    const { removeManifestLocal, refreshManifestLocales } = useDiligenciarFormStore.getState();

    const { mutate, isPending} = useMutation({
        mutationFn: createManifest,
        onError(error) {
            toast.show(error.message || 'Error en la creación del manifiesto', { type: 'error', placement: 'top' });
        },
        onSuccess(data) {
            // Si se creó correctamente en backend, eliminar el manifiesto local
            if (manifest?.id) {
                removeManifestLocal(manifest.id);
                // refrescar el store local desde storage
                refreshManifestLocales();
            }
            toast.show('Manifiesto sincronizado correctamente', { type: 'success', placement: 'top' });
            router.back();
        }
    })

    const { mutate: uploadImages, isPending: isUploading } = useMutation({
        mutationFn: uploadImagesToCloudinary,
        onError(error) {
            toast.show(error.message || 'Error subiendo imágenes', { type: 'error', placement: 'top' });
        },
        onSuccess(data) {
            toast.show('Imágenes subidas correctamente', { type: 'success', placement: 'top' });
            handleUpload(data);
        }
    })

    const handleUploadImages = () => {
        

        if (!manifest) return;

        // Validate required numeric fields that may be `number | null`
        if (manifest.clientId == null) {
            toast.show('Cliente no encontrado', { type: 'warning', placement: 'top' });
            return;
        }
        if (manifest.plateId == null) {
            toast.show('Placa no encontrada', { type: 'warning', placement: 'top' });
            return;
        }

        if (manifest.manifestTemplateId == null) {
            toast.show('Plantilla no encontrada', { type: 'warning', placement: 'top' });
            return;
        }

        let photosToSend = manifest.photos || [];

        if (photosToSend.length > 0) {
            uploadImages(photosToSend)
        }else {
            toast.show('No hay imágenes', { type: 'info', placement: 'top' });
        }
    }

    const handleUpload = (data: string[]) => {
        if (!manifest) return;

        // Validate required numeric fields that may be `number | null`
        if (manifest.clientId == null) {
            toast.show('Cliente no encontrado', { type: 'warning', placement: 'top' });
            return;
        }
        if (manifest.plateId == null) {
            toast.show('Placa no encontrada', { type: 'warning', placement: 'top' });
            return;
        }

        if (manifest.manifestTemplateId == null) {
            toast.show('Plantilla no encontrada', { type: 'warning', placement: 'top' });
            return;
        }

        // // Antes de crear el formData, subir imágenes si hay fotos locales
        // let photosToSend = manifest.photos || [];
        // if (photosToSend.length > 0) {
        //     try {
        //         toast.show('Subiendo imágenes...', { type: 'normal' });
        //         const uploaded = await uploadImagesToCloudinary(photosToSend);
        //         photosToSend = uploaded;
        //     } catch (err) {
        //         toast.show((err as Error).message || 'Error subiendo imágenes', { type: 'danger' });
        //         console.log(err);
        //         return; // abortar si falla la subida
                
        //     }
        // }

        // console.log('Handle Upload', manifest.plateId);
        // console.log('Preparando formData - plateId:', manifest.plateId, 'tipo:', typeof manifest.plateId);
        
        const formData : NewManifestFormType = {
            clientId: manifest.clientId,
            plateId: manifest.plateId,
            location: manifest.location,
            date: manifest.date,
            dateFinal: manifest.dateFinal,
            manifestTemplateId: manifest.manifestTemplateId,
            items: manifest.items,
            photos: data,
            observations: manifest.observations,
            signature: manifest.signature,
            signatureClient: manifest.signatureClient,
            contactClient: manifest.contactClient,
            positionClient: manifest.positionClient,
            phone: manifest.phone,
        }

        mutate({formData});
    }


    const handleRemoveManifestLocal = () => {
        // importar Alert dinámicamente para no tocar los imports superiores

        if (!manifest?.id) return;

        Alert.alert(
            'Eliminar formulario',
            '¿Estás seguro que deseas eliminar este formulario local? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        removeManifestLocal(manifest.id);
                        refreshManifestLocales();
                        toast.show('Manifiesto local eliminado', { type: 'success' });
                        router.back();
                    }
                }
            ],
            { cancelable: true }
        );
    }

    const disabled =
        !manifest ||
        !isConnected ||
        !isInternetReachable ||
        isPending ||
        isUploading ||
        !user;

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

                    <TouchableOpacity
                        onPress={handleUploadImages}
                        activeOpacity={0.85}
                        
                        style={{
                            backgroundColor: disabled ? '#93c5fd' : '#a3c614',
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
                            opacity: isUploading || isPending ? 0.7 : 1
                        }}
                        disabled={(isUploading || isPending) || disabled}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: isTablet ? 20 : 16, letterSpacing: 0.5 }}>
                            {isPending || isUploading ? 'Subiendo...' : 'Cargar'}
                        </Text>
                    </TouchableOpacity>


                </View>

                {   !manifest && 
                    <Text style={{ textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 16 }}>Manifiesto no encontrado</Text>
                }

                <SelectCliente clienteId={manifest?.clientId} readOnly />
                <SelectCar plateId={manifest?.plateId} readOnly />

                {/* Ubicación solo lectura reutilizable */}
                <UbicacionInput
                    value={manifest?.location || 'Sin ubicación'}
                    isTablet={isTablet}
                    readOnly
                />

                 {/* Fechas */}
                <FechaInput 
                    date={manifest?.date} 
                    dateFinal={manifest?.dateFinal} 
                    readOnly
                />

                {/* Plantilla de items solo lectura */}
                <SelectTemplate
                    readOnly
                    templateId={manifest?.manifestTemplateId ?? undefined}
                    items={manifest?.items}
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
                    userName={user?.name || ''}
                    userRole={user?.rol.name || ''}
                    signature={manifest?.signature || ''}
                    signatureClient={manifest?.signatureClient || ''}
                    phone={manifest?.phone || ''}
                    contactClient={manifest?.contactClient || ''}
                    positionClient={manifest?.positionClient || ''}
                    readOnly
                />

            {/* Botón grande para eliminar el formulario local */}
            <TouchableOpacity
                onPress={handleRemoveManifestLocal}
                activeOpacity={0.85}
                disabled={disabled}
                style={{
                    backgroundColor:  disabled ? '#e53935' : '#cccccc',
                    paddingVertical: 18,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginTop: 32,
                    marginBottom: 32,
                    width: '100%',
                    alignSelf: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 }}>
                    Eliminar formulario local
                </Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

export default Index;
