import React from 'react';
import { Text, TextInput, View } from 'react-native';
import FieldError from './FieldError';

interface UbicacionInputProps {
    value: string;
    onChangeText?: (text: string) => void;
    error?: string;
    readOnly?: boolean;
    isTablet?: boolean;
}

function UbicacionInput({ value, onChangeText, error, readOnly = false, isTablet = false }: UbicacionInputProps) {
    return (
        <View style={{ marginBottom: isTablet ? 32 : 16 }}>
        <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 6, fontSize: isTablet ? 22 : 16 }}>
            Lugar
        </Text>
        {readOnly ? (
            <View style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 10, padding: isTablet ? 18 : 10, minHeight: isTablet ? 48 : 32, justifyContent: 'center' }}>
            <Text style={{ color: '#334155', fontSize: isTablet ? 18 : 14 }}>{value?.toLowerCase() || 'Sin ubicación'}</Text>
            </View>
        ) : (
            <TextInput
                value={value}
                onChangeText={text => onChangeText?.(text.toLowerCase())}
                placeholder="Lugar del servicio"
                style={{ 
                    borderWidth: 1, 
                    borderColor: '#d1d5db', 
                    borderRadius: 10, 
                    padding: isTablet ? 18 : 12, 
                    backgroundColor: '#fff', 
                    fontSize: isTablet ? 20 : 16, 
                    width: '100%',
                    minHeight: isTablet ? 56 : 48
                }}
                placeholderTextColor="#9ca3af"
                returnKeyType="done"
                blurOnSubmit={true}
                textContentType="location"
            />
        )}
        {error && <FieldError error={error} />}
        </View>
    );
}

export default UbicacionInput;
