import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';
import { getTemplates } from '../../services/templateService';
import { ItemCategoryType, ItemTemplateType } from '../../types/templateType';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { formatearUnidad } from '../../utils/transformData';



function groupByCategoria(items: ItemTemplateType[]) {
    return items.reduce<Record<ItemCategoryType, ItemTemplateType[]>>((acc, item) => {
        const cat = item.categoria || 'OTRO';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<ItemCategoryType, ItemTemplateType[]>);
}

function SelectTemplate() {
    const {setTemplates, saveLocalTemplates, refreshTemplates, form, setForm} = useDiligenciarForm()
    const isTablet = Dimensions.get('window').width >= 768;
    const [showList, setShowList] = useState(form.templateId == null);
    const { isConnected, isInternetReachable } = useNetworkStatus();

    
    const { data, isLoading, error } = useQuery({
        queryKey: ['templates'],
        queryFn: getTemplates,
        enabled: isConnected && isInternetReachable
    });
    const selectedTemplate = data?.templates.find((t) => t.id === form.templateId);

    const handleSeletedTemplate = (id: number) => {
        setForm({ templateId: id });
        setShowList(false);
    };
    const handleDeleteSeletedTemplate = () => {
        setForm({ templateId: null });
        setShowList(true);
    };

    
    useEffect(() => {
        refreshTemplates();
    }, []);

    useEffect(() => {
        if (data && data.templates.length > 0) {
            setTemplates(data.templates);
            saveLocalTemplates();
        }
    }, [data]);

    useEffect(() => {
        setShowList(form.templateId === null);
    }, [form.templateId]);

    if (isLoading) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">Cargando plantillas...</Text>
            </View>
        );
    }

    if (!data || data.templates.length === 0) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">No hay plantillas disponibles</Text>
            </View>
        );
    }

    return (
        <View className="my-4">
            <Text className="mb-2 text-lg font-bold text-azul">Plantilla de Manifiesto</Text>
            {showList ? (
                <View className={`grid ${isTablet ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    {data.templates.map((template) => (
                        <TouchableOpacity
                            key={template.id}
                            activeOpacity={0.7}
                            className="p-4 bg-gray-100 border-2 rounded-lg shadow-sm border-azul"
                            onPress={() => handleSeletedTemplate(template.id)}
                        >
                            <Text className="mb-1 text-base font-semibold text-azul">{template.name}</Text>
                            <Text className="text-sm text-gray-600">{template.items.length} ítems</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : selectedTemplate ? (
                <View style={styles.selectedContainer}>
                    <Text style={styles.selectedTitle}>{selectedTemplate.name}</Text>
                    <TouchableOpacity style={styles.clearBtn} onPress={handleDeleteSeletedTemplate}>
                        <Text style={styles.clearBtnText}>Limpiar selección</Text>
                    </TouchableOpacity>
                    <Text style={styles.selectedSubtitle}>{selectedTemplate.items.length} ítems</Text>
                    {/* Agrupar por categoría */}
                    {Object.entries(groupByCategoria(selectedTemplate.items)).map(([categoria, items]) => (
                        <View key={categoria} style={styles.categoriaBlock}>
                            <Text style={styles.categoriaTitle}>{categoria}</Text>
                            {items.map((item) => (
                                <View key={item.id} style={styles.itemRow}>
                                    <View style={styles.itemRowTop}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemMeta}>{formatearUnidad(item.unidad)}</Text>
                                    </View>
                                    <View style={styles.inputPlaceholder}>
                                        <Text style={styles.inputPlaceholderText}>[Campo aquí]</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    selectedContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 4,
        textAlign: 'center',
    },
    clearBtn: {
        alignSelf: 'center',
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginVertical: 6,
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        borderRadius: 6,
    },
    clearBtnText: {
        fontWeight: 'bold',
        color: '#dc2626',
    },
    selectedSubtitle: {
        marginBottom: 8,
        color: '#374151',
        textAlign: 'center',
    },
    categoriaBlock: {
        marginBottom: 16,
        marginTop: 8,
    },
    categoriaTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: '#1e40af',
        color: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginBottom: 4,
        textAlign: 'center',
    },
    itemRow: {
        marginBottom: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
        padding: 8,
    },
    itemRowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    itemName: {
        flex: 1,
        color: '#1f2937',
        fontWeight: '500',
    },
    itemMeta: {
        marginLeft: 8,
        fontSize: 12,
        color: '#6b7280',
    },
    inputPlaceholder: {
        marginTop: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 4,
        paddingVertical: 6,
        alignItems: 'center',
    },
    inputPlaceholderText: {
        color: '#9ca3af',
        fontSize: 12,
    },
});

export default SelectTemplate;
