import React from 'react';
import { Text } from 'react-native';

interface FieldErrorProps {
    error?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ error }) => {
    if (!error) return null;
    return (
        <Text
            style={{
                width: '100%',
                backgroundColor: '#fee2e2',
                textTransform: 'uppercase',
                color: '#b91c1c',
                fontSize: 16,
                fontWeight: 'bold',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                marginTop: 4,
                marginBottom: 8,
                textAlign: 'center',
            }}
        >
            {error}
        </Text>
    );
};

export default FieldError;
