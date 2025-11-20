import React, { useEffect, useState } from 'react';
import { useDiligenciarFormStore } from '../../store/diligenciarFormStore';
import FieldError from './FieldError';
import { useQuery } from '@tanstack/react-query';
import { getSelectClient } from '../../services/clienteService';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

function normalize(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}
type SelectClienteProps = {
    clienteId?: number | null | undefined;
    readOnly?: boolean;
}

function SelectCliente({ clienteId, readOnly = false }: SelectClienteProps) {
    const { clientes, setClientes, saveLocalClientes, refreshClientes, form, setForm, errores } = useDiligenciarFormStore();
    const { isConnected, isInternetReachable } = useNetworkStatus();
    // Si es readOnly, siempre mostrar el cliente seleccionado
    const [showList, setShowList] = useState(readOnly ? false : form.clientId == null);
    const [search, setSearch] = useState('');

    // Solo consulta si no hay clientes locales
    const { data, isLoading, error } = useQuery({
        queryKey: ['clientes'],
        queryFn: () => getSelectClient({}),
        enabled: !!(isConnected && isInternetReachable && clientes.length === 0),
        retry: false,
    });
    // Siempre usa el store local
    const clientList = clientes;

    useEffect(() => {
        refreshClientes();
    }, []);

    useEffect(() => {
        if (data && data.clientes && data.clientes.length > 0) {
            setClientes(data.clientes);
            saveLocalClientes();
        }
    }, [data]);

    useEffect(() => {
        if (!readOnly) {
            setShowList(form.clientId == null);
        }
    }, [form.clientId, readOnly]);

    const handleSelectClient = (id: number) => {
        if (readOnly) return;
        setForm({ clientId: id });
        setShowList(false);
    };

    const handleDeleteSelectedClient = () => {
        if (readOnly) return;
        setForm({ clientId: null });
        setShowList(true);
    };

    // Si es readOnly, usar el clienteId prop, si no, usar el del form
    const selectedClient = clientList.find((c) => c.id === (readOnly ? clienteId : form.clientId));

    // Filtrado
    const filteredClients = search.trim().length === 0
        ? clientList
        : clientList.filter((c) => {
            const s = normalize(search);
            return (
                normalize(c.name).includes(s) ||
                normalize(c.alias).includes(s) ||
                c.identificacion.toLowerCase().includes(s)
            );
        });

    if (isLoading && clientList.length === 0) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">Cargando clientes...</Text>
            </View>
        );
    }

    if (!clientList || clientList.length === 0) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">No hay clientes disponibles</Text>
            </View>
        );
    }

    return (
        <View style={{ marginVertical: 16 }}>
            <Text className="mb-2 text-lg font-bold text-azul">Cliente</Text>
            {showList && !readOnly ? (
                <>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar cliente por nombre, alias o identificación"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!readOnly}
                    />
                    <FlatList
                        data={filteredClients}
                        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                        style={{ maxHeight: 256, backgroundColor: '#f3f4f6', borderRadius: 8 }}
                        // nestedScrollEnabled={true}
                        scrollEnabled={false}
                        ListEmptyComponent={<Text style={styles.noResults}>No hay clientes disponibles</Text>}
                        renderItem={({ item: client }) => (
                            <TouchableOpacity
                                style={[styles.item, { backgroundColor: '#f3f4f6' }]}
                                onPress={() => handleSelectClient(client.id)}
                                disabled={readOnly}
                            >
                                <Text style={styles.itemName}>{client.name}</Text>
                                <Text style={styles.itemMeta}>{client.alias} • {client.identificacionType.toUpperCase()} {client.identificacion}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </>
            ) : (
                <View style={styles.selectedRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.selectedName}>{selectedClient?.name || 'Cliente seleccionado'}</Text>
                        <Text style={styles.selectedMeta}>{selectedClient?.alias} • {selectedClient?.identificacionType?.toUpperCase()} {selectedClient?.identificacion}</Text>
                    </View>
                    {!readOnly && (
                        <TouchableOpacity style={styles.clearBtn} onPress={handleDeleteSelectedClient}>
                            <Text style={styles.clearBtnText}>Limpiar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {errores?.clientId && !readOnly ? <FieldError error={errores.clientId} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 8,
        fontSize: 16,
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        backgroundColor: '#fff',
    },
    itemName: {
        fontSize: 16,
        color: '#1e40af',
        fontWeight: 'bold',
    },
    itemMeta: {
        fontSize: 13,
        color: '#6b7280',
    },
    noResults: {
        padding: 16,
        color: '#6b7280',
        textAlign: 'center',
        
    },
    selectedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        marginBottom: 4,
    },
    selectedName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e40af',
    },
    selectedMeta: {
        fontSize: 13,
        color: '#6b7280',
    },
    clearBtn: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        borderRadius: 6,
        marginLeft: 12,
    },
    clearBtnText: {
        fontWeight: 'bold',
        color: '#dc2626',
    },
});

export default SelectCliente;
