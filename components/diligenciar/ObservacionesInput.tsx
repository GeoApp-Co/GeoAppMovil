import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import FieldError from './FieldError';

interface ObservacionesInputProps {
    value: string;
    onChangeText?: (text: string) => void;
    error?: string;
    readOnly?: boolean;
    isTablet?: boolean;
}

function ObservacionesInput({ value, onChangeText, error, readOnly = false, isTablet = false }: ObservacionesInputProps) {
    const [inputHeight, setInputHeight] = useState(isTablet ? 180 : 80);

    return (
        <View style={{ marginBottom: isTablet ? 32 : 16 }}>
            <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 6, fontSize: isTablet ? 22 : 16 }}>
                Observaciones
            </Text>
            {readOnly ? (
                <View style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 10, padding: isTablet ? 18 : 10, minHeight: isTablet ? 80 : 48, justifyContent: 'center' }}>
                    <Text style={{ color: '#334155', fontSize: isTablet ? 18 : 14, textAlignVertical: 'top' }}>{value || 'Sin observaciones'}</Text>
                </View>
            ) : (
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Observaciones del servicio..."
                    multiline
                    numberOfLines={isTablet ? 6 : 4}
                    style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 10,
                        padding: isTablet ? 18 : 12,
                        backgroundColor: '#fff',
                        textAlignVertical: 'top',
                        fontSize: isTablet ? 18 : 16,
                        minHeight: isTablet ? 120 : 80,
                        maxHeight: isTablet ? 200 : 120,
                        height: Math.max(inputHeight, isTablet ? 120 : 80),
                        width: '100%'
                    }}
                    onContentSizeChange={e => {
                        const newHeight = e.nativeEvent.contentSize.height;
                        const maxHeight = isTablet ? 200 : 120;
                        setInputHeight(Math.min(newHeight, maxHeight));
                    }}
                    placeholderTextColor="#9ca3af"
                    returnKeyType="default"
                    textContentType="none"
                    scrollEnabled={true}
                />
            )}
            {error && <FieldError error={error} />}
        </View>
    );
}

export default ObservacionesInput;
