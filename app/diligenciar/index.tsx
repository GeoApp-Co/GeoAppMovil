import React, { useEffect } from 'react';
import { Text, TextInput, View, ScrollView, Platform, Dimensions, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';
import FieldError from '../../components/diligenciar/FieldError';
import UbicacionInput from '../../components/diligenciar/UbicacionInput';
import ObservacionesInput from '../../components/diligenciar/ObservacionesInput';
import SelectCar from '../../components/diligenciar/SelectCar';
import SelectTemplate from '../../components/diligenciar/SelectTemplate';
import SelectCliente from '../../components/diligenciar/SelectCliente';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useQueryClient } from '@tanstack/react-query';
import Firmas from '../../components/diligenciar/Firmas';
import { useAuth } from '../../hooks/useAuth';
import FotosInput from '../../components/diligenciar/FotosInput';
import { useToast } from 'react-native-toast-notifications';
import FechaInput from '../../components/diligenciar/FechaInput';


function DiligenciarForm() {
    const isTablet = Dimensions.get('window').width >= 768;
    const { form, setForm, resetForm, errores, addManifestLocal, saveLocalManifestLocales, manifestLocales, refreshManifestLocales, clearAllStorage, validateField, clearFieldError } = useDiligenciarForm();
    const { user } = useAuth();
    

    const { isConnected, isInternetReachable } = useNetworkStatus();
    const queryClient = useQueryClient();
    const toast = useToast();

    const handleSubmit = () => {

        if (errores && Object.keys(errores).length > 0) {
            const firstError = Object.values(errores)[0];
            toast.show(`Error: ${firstError}`, { type: 'danger', placement: 'top' });
            return;
        }


        addManifestLocal(form);
        
        saveLocalManifestLocales();
        refreshManifestLocales();
        resetForm()
        toast.show('Manifiesto guardado localmente', { type: 'success', placement: 'top' })
    };

    // Botón sincronizar
    const handleSync = () => {
        clearAllStorage()
        toast.show('Sincronización iniciada...', { type: 'success', placement: 'top'  })
    };

    const handleResetForm = () => {
        resetForm();
        toast.show('Formulario reiniciado', { type: 'success', placement: 'top' });
    }

    const handleObservationsChange = (text: string) => {
        setForm({ observations: text });
    }

    // Validar si el formulario es válido para envío
    const isFormValid = () => {
        // Verificar que no hay errores
        if (errores && Object.keys(errores).length > 0) {
            return false;
        }
        
        // Verificar campos obligatorios
        const requiredFieldsValid = 
            form.clientId !== null &&
            form.plateId !== null &&
            form.location?.trim() !== '' &&
            form.manifestTemplateId !== null &&
            form.signature?.trim() !== '' &&
            form.signatureClient?.trim() !== '' &&
            form.contactClient?.trim() !== '' &&
            form.positionClient?.trim() !== '' &&
            form.photos && form.photos.length > 0; // Al menos una foto
        
        return requiredFieldsValid;
    };

    // useEffect(() => {
    //     if (manifestLocales.length > 0) {
    //         saveLocalManifestLocales()
    //     }
    // }, [manifestLocales])


    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView 
                style={{ flex: 1 }} 
                contentContainerStyle={{ 
                    padding: isTablet ? 48 : 16, 
                    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
                    alignSelf: 'center', 
                    width: isTablet ? '80%' : '100%',
                    maxWidth: isTablet ? '80%' : '100%',
                    minWidth: isTablet ? '80%' : '100%',
                    minHeight: Platform.OS === 'android' ? Dimensions.get('window').height : undefined
                }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                automaticallyAdjustContentInsets={false}
                // enableOnAndroid={true}
                // extraHeight={120}
                // extraScrollHeight={120}
            >
                <Text style={{ fontSize: isTablet ? 36 : 24, fontWeight: 'bold', color: '#1e40af', textAlign: 'center', marginBottom: isTablet ? 32 : 16 }}>
                    Diligenciar Manifiesto
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: isTablet ? 1 : 16 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleResetForm}
                        style={{
                            backgroundColor: '#f59e42',
                            paddingVertical: isTablet ? 16 : 10,
                            paddingHorizontal: isTablet ? 32 : 18,
                            borderRadius: 10,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.12,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Text style={{ color: '#fff', fontFamily: 'Raleway-Bold', fontSize: isTablet ? 20 : 16, letterSpacing: 0.5 }}>Reiniciar formulario</Text>
                    </TouchableOpacity>
                    <View style={{ width: isTablet ? 24 : 12 }} />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSync}
                        disabled={!(isConnected && isInternetReachable) || !user}
                        style={{
                            backgroundColor: !(isConnected && isInternetReachable) ? '#a5b4fc' : '#2563eb',
                            paddingVertical: isTablet ? 16 : 10,
                            paddingHorizontal: isTablet ? 32 : 18,
                            borderRadius: 10,
                            alignItems: 'center',
                            opacity: !((isConnected && isInternetReachable) && user) ? 0.6 : 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.12,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Text style={{ color: '#fff', fontFamily: 'Raleway-Bold', fontSize: isTablet ? 20 : 16, letterSpacing: 0.5 }}>Sincronizar datos</Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={{ height: isTablet ? 32 : 16 }} /> */}

                {/** Cliente */}
                <SelectCliente />

                {/* Carros */}
                <SelectCar />

                {/* Ubicación */}
                <UbicacionInput
                    value={form.location}
                    onChangeText={text => setForm({ location: text })}
                    error={errores.location}
                    isTablet={isTablet}
                />

                {/* Fechas */}
                <FechaInput />

                <SelectTemplate />

                <FotosInput />

                {/* Observaciones */}
                <ObservacionesInput
                    value={form.observations}
                    onChangeText={handleObservationsChange}
                    error={errores.observations}
                    isTablet={isTablet}
                />

                <Firmas 
                    userName={user?.name || ''} 
                    userRole={user?.rol.name || ''}
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!isFormValid()}
                    activeOpacity={isFormValid() ? 0.85 : 1}
                    style={{
                        marginTop: 24,
                        backgroundColor: isFormValid() ? '#22c55e' : '#9ca3af',
                        borderRadius: 10,
                        paddingVertical: isTablet ? 18 : 14,
                        width: '100%',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isFormValid() ? 0.12 : 0.05,
                        shadowRadius: 4,
                        elevation: isFormValid() ? 2 : 1,
                    }}
                >
                    <Text style={{ 
                        color: isFormValid() ? '#fff' : '#6b7280', 
                        fontFamily: 'Raleway-Bold', 
                        fontSize: isTablet ? 22 : 18, 
                        letterSpacing: 0.5 
                    }}>
                        Guardar
                    </Text>
                </TouchableOpacity>
                
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
});


export default DiligenciarForm;
