import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';
import FieldError from './FieldError';
import { Ionicons } from '@expo/vector-icons';

const MAX_PHOTOS = 3;

type FotosInputProps = {
    photos?: string[];
    readOnly?: boolean;
}

const FotosInput: React.FC<FotosInputProps> = ({ photos, readOnly }) => {
    const { form, setForm, errores } = useDiligenciarForm();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const formPhotos = photos ?? form.photos;

    // Pedir permisos solo una vez
    React.useEffect(() => {
        (async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso requerido', 'Se necesita permiso de cámara para tomar fotos.');
        }
        })();
    }, []);

    const pickImage = async () => {
        if (form.photos.length >= MAX_PHOTOS) {
            Alert.alert('Límite de fotos', `Solo puedes agregar hasta ${MAX_PHOTOS} fotos.`);
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.7,
            base64: false,
        });

        if (!result.canceled && result.assets && result.assets[0]?.uri) {
            setForm({ photos: [...form.photos, result.assets[0].uri] });
        }
    };

    const pickFromGallery = async () => {
        if (form.photos.length >= MAX_PHOTOS) {
            Alert.alert('Límite de fotos', `Solo puedes agregar hasta ${MAX_PHOTOS} fotos.`);
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        base64: false,
        allowsMultipleSelection: true,
        selectionLimit: MAX_PHOTOS - form.photos.length,
        });
        if (!result.canceled && result.assets) {
        const uris = result.assets.map(a => a.uri).filter(Boolean);
        setForm({ photos: [...form.photos, ...uris] });
        }
    };

    const removePhoto = (idx: number) => {
        Alert.alert('Eliminar foto', '¿Seguro que deseas eliminar esta foto?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {
            setForm({ photos: form.photos.filter((_, i) => i !== idx) });
        }}
        ]);
    };

    return (
        <View style={{ marginBottom: 24 }}>
            <Text style={styles.label}>Fotos (máx. {MAX_PHOTOS})</Text>
            {errores?.photos ? <FieldError error={errores.photos} /> : null}

            {/* Botones de agregar */}
            {   !readOnly &&
                <View style={{ flexDirection: 'row', alignItems: 'center',  gap: 16, marginBottom: 16 }}>
                    {form.photos.length < MAX_PHOTOS && (
                        <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
                            <Ionicons name="camera" size={32} color="#2563eb" />
                            <Text style={{ color: '#2563eb', fontSize: 12 }}>Cámara</Text>
                        </TouchableOpacity>
                    )}
                    {form.photos.length < MAX_PHOTOS && (
                        <TouchableOpacity style={styles.addBtn} onPress={pickFromGallery}>
                            <Ionicons name="images" size={32} color="#2563eb" />
                            <Text style={{ color: '#2563eb', fontSize: 12 }}>Galería</Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
            
            {/* Imágenes */}
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 16,
                    justifyContent: isTablet ? 'flex-start' : 'center',
                }}
            >
                {formPhotos.map((uri, idx) => (
                    <View
                        key={uri}
                        style={{
                            width: '100%',
                            marginBottom: 16,
                            position: 'relative',
                        }}
                    >
                        <Image
                            source={{ uri }}
                            style={{
                                width: '100%',
                                height: isTablet ? 220 : 180,
                                borderRadius: 0,
                                borderWidth: 1,
                                borderColor: '#d1d5db',
                                backgroundColor: '#f3f4f6',
                            }}
                            resizeMode="contain"
                        />
                        {!readOnly &&
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: '#fff',
                                    borderRadius: 16,
                                    padding: 4,
                                    elevation: 3,
                                    borderWidth: 1,
                                    borderColor: '#dc2626',
                                    zIndex: 2,
                                }}
                                onPress={() => removePhoto(idx)}
                            >
                                <Ionicons name="trash" size={24} color="#dc2626" />
                            </TouchableOpacity>
                        }
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        color: '#1e40af',
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 16,
    },
        // ...eliminado: photoBox, photo, removeBtn...
    addBtn: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2563eb',
        backgroundColor: '#f1f5fd',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
});

export default FotosInput;
