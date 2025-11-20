import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View, StyleSheet, TextInput, Switch, Modal, FlatList, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';
import FieldError from './FieldError';
import { getTemplates } from '../../services/templateService';
import { ItemCategoryType, ItemTemplateType } from '../../types/templateType';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { formatearUnidad } from '../../utils/transformData';
import { ItemCantidad } from '../../types/manifestType';



function groupByCategoria(items: ItemTemplateType[]) {
    return items.reduce<Record<ItemCategoryType, ItemTemplateType[]>>((acc, item) => {
        const cat = item.categoria || 'OTRO';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<ItemCategoryType, ItemTemplateType[]>);
}

// Función auxiliar para detectar si es item de checkbox (servicio/aromatizante)
const isCheckboxItem = (itemName: string, categoria: string, unidad: string) => {
    const isServiceCategory = categoria.toLowerCase().includes('servicio');
    return (
        isServiceCategory ||
        itemName.toLowerCase().includes("aromatizante") ||
        unidad.toLowerCase() === "servicio"
    );
};

// Función auxiliar para detectar tipos de categorías
const getCategoryType = (categoria: string) => {
    const lowerCategoria = categoria.toLowerCase();
    return {
        isServiceCategory: lowerCategoria.includes('servicio'),
        isSpecialCategory: lowerCategoria === "especial",
        isPlagueCategory: lowerCategoria.includes('plagas controladas'),
        isProductPlagueCategory: lowerCategoria.includes('producto control de plagas')
    };
};

// Opciones para selector de nivel de plagas
const plagueNivelesOptions = [
    { label: '----', value: 0 },
    { label: 'Bajo', value: 1 },
    { label: 'Medio', value: 2 },
    { label: 'Alto', value: 3 },
];

// Función para obtener el texto del nivel de plagas
const getPlagueNivelText = (nivel: number): string => {
    const option = plagueNivelesOptions.find(opt => opt.value === nivel);
    return option ? option.label : '----';
};

type SelectTemplateProps = {
    readOnly?: boolean;
    templateId?: number;
    items?: ItemCantidad[];
};

const SelectTemplate: React.FC<SelectTemplateProps> = ({ readOnly = false, templateId, items }) => {
    const { setTemplates, saveLocalTemplates, refreshTemplates, form, setForm, templates, setFormItems, errores } = useDiligenciarForm();
    const isTablet = Dimensions.get('window').width >= 768;
    const [showList, setShowList] = useState(form.manifestTemplateId == null);
    const { isConnected, isInternetReachable } = useNetworkStatus();

    const { data, isLoading, error } = useQuery({
        queryKey: ['templates'],
        queryFn: getTemplates,
        enabled: !!(isConnected && isInternetReachable && templates.length === 0),
        retry: false,
    });

    // Usar datos locales si no hay data
    const templateList = data?.templates ?? templates ?? [];
    const selectedTemplate = templateList.find((t) => t.id === (readOnly ? templateId : form.manifestTemplateId));

    const handleSeletedTemplate = (id: number) => {
        setForm({ manifestTemplateId: id });
        setShowList(false);
        // Buscar el template seleccionado y setear sus items en el formulario
        const t = templateList.find((tpl) => tpl.id === id);
        setFormItems(t?.items || []);
    };
    const handleDeleteSeletedTemplate = () => {
        setForm({ manifestTemplateId: null });
        setShowList(true);
        setFormItems([]);
    };

    // Estado local para edición de inputs numéricos
    const [inputValues, setInputValues] = useState<Record<string, string>>({});

    // Estado para modal de selección de nivel de plagas
    const [plagueModalVisible, setPlagueModalVisible] = useState(false);
    const [currentPlagueItemId, setCurrentPlagueItemId] = useState<number | null>(null);

    // Estado para selector de fecha de vencimiento
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [currentDateItemId, setCurrentDateItemId] = useState<number | null>(null);
    const [tempDate, setTempDate] = useState(new Date());

    // Actualizar valor local del input (permite escribir punto o coma) y actualiza en tiempo real
    const handleInputChange = (itemId: number, field: string, value: string) => {
        setInputValues((prev) => ({ ...prev, [`${itemId}_${field}`]: value }));
        
        // Actualizar en tiempo real si el valor es válido
        let cleanValue = value.replace(',', '.');
        if (cleanValue === '' || (!isNaN(Number(cleanValue)) && Number(cleanValue) >= 0)) {
            const numVal = cleanValue === '' ? 0 : Math.max(0, parseFloat(cleanValue));
            setForm({
                items: (form.items || []).map((it) =>
                    it.itemId === itemId ? { ...it, [field]: numVal } : it
                )
            });
        }
    };

    // Al perder el foco, limpiar el input local si es necesario
    const handleInputBlur = (itemId: number, field: string) => {
        const key = `${itemId}_${field}`;
        let value = inputValues[key] ?? '';
        value = value.replace(',', '.');
        let val = 0;
        if (value !== '' && !isNaN(Number(value))) {
            val = Math.max(0, parseFloat(value));
        }
        // Actualizar el input local para mostrar el valor limpio
        setInputValues((prev) => ({ ...prev, [key]: val === 0 ? '' : val.toString() }));
    };

    // Para checkboxes de servicio/aromatizante
    const handleCheckboxChange = (itemId: number, checked: boolean) => {
        setForm({
            items: (form.items || []).map((it) =>
                it.itemId === itemId ? { ...it, cantidad: checked ? 1 : 0 } : it
            )
        });
    };

    // Para selector de nivel de plagas
    const handlePlagueModalOpen = (itemId: number) => {
        setCurrentPlagueItemId(itemId);
        setPlagueModalVisible(true);
    };

    const handlePlagueNivelSelect = (nivel: number) => {
        if (currentPlagueItemId) {
            setForm({
                items: (form.items || []).map((it) =>
                    it.itemId === currentPlagueItemId ? { ...it, cantidad: nivel } : it
                )
            });
        }
        setPlagueModalVisible(false);
        setCurrentPlagueItemId(null);
    };

    // Para campos de texto adicionales (ubicacion, lote)
    const handleTextFieldChange = (itemId: number, field: string, value: string) => {
        setForm({
            items: (form.items || []).map((it) =>
                it.itemId === itemId ? { ...it, [field]: value } : it
            )
        });
    };

    // Funciones para el selector de fecha de vencimiento
    const handleDatePickerOpen = (itemId: number) => {
        setCurrentDateItemId(itemId);
        // Obtener la fecha actual del item o usar fecha actual
        const currentItem = (form.items || []).find(it => it.itemId === itemId);
        if (currentItem?.dateVencimiento) {
            // Si ya hay fecha, parsearla (formato: YYYY-MM-DD)
            const existingDate = new Date(currentItem.dateVencimiento);
            setTempDate(isNaN(existingDate.getTime()) ? new Date() : existingDate);
        } else {
            setTempDate(new Date());
        }
        setDatePickerVisible(true);
    };

    const handleDatePickerChange = (event: any, selectedDate?: Date) => {
        setDatePickerVisible(false);
        if (selectedDate && currentDateItemId) {
            // Formatear la fecha para base de datos (YYYY-MM-DD)
            const dbFormat = selectedDate.toISOString().split('T')[0];
            setForm({
                items: (form.items || []).map((it) =>
                    it.itemId === currentDateItemId ? { ...it, dateVencimiento: dbFormat } : it
                )
            });
        }
        setCurrentDateItemId(null);
    };

    // Función para formatear la fecha para mostrar (Mes Año)
    const formatDateForDisplay = (dateString: string): string => {
        if (!dateString) return 'Seleccionar fecha';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Seleccionar fecha';
        
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    useEffect(() => {
        refreshTemplates();
    }, []);

    useEffect(() => {
        if (data && data?.templates?.length > 0) {
            setTemplates(data.templates);
            saveLocalTemplates();
        }
    }, [data]);

    useEffect(() => {
        setShowList(form.manifestTemplateId === null);
    }, [form.manifestTemplateId]);

    if (isLoading && templateList.length === 0) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">Cargando plantillas...</Text>
            </View>
        );
    }

    if (!templateList || templateList.length === 0) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">No hay plantillas disponibles</Text>
            </View>
        );
    }

    // Función para calcular sumas por unidad dentro de una categoría
    function getResumenPorUnidad(templateItems: ItemTemplateType[], categoria: string, itemsToShow: ItemCantidad[]) {
        // Map: unidad -> suma
        const resumen: Record<string, number> = {};
        const { isServiceCategory, isPlagueCategory } = getCategoryType(categoria);
        
        templateItems.forEach(item => {
            const formItem: ItemCantidad = itemsToShow.find((it) => it.itemId === item.id) ?? { cantidad: 0 } as any;
            // Solo sumar si no es servicio/aromatizante ni categoria de plagas
            const isServicio = isCheckboxItem(item.name, categoria, item.unidad);
            if (!isServicio && !isPlagueCategory) {
                const unidad = formatearUnidad(item.unidad);
                resumen[unidad] = (resumen[unidad] || 0) + (formItem.cantidad || 0);
            }
        });
        return resumen;
    }

    // Visualización solo lectura
    if (readOnly && selectedTemplate) {
        // items: lista de ItemCantidad a mostrar
        const itemsToShow = items || [];
        return (
            <View className="my-4">
                <Text className="mb-2 text-lg font-bold text-azul">Plantilla de Manifiesto</Text>
                <Text style={styles.selectedTitle}>{selectedTemplate.name}</Text>
                <Text style={styles.selectedSubtitle}>{selectedTemplate.items.length} ítems</Text>
                {Object.entries(groupByCategoria(selectedTemplate.items)).map(([categoria, templateItems]) => {
                    // Resumen por unidad
                    const resumen = getResumenPorUnidad(templateItems, categoria, itemsToShow);
                    return (
                        <View key={categoria} style={styles.categoriaBlock}>
                            <Text style={styles.categoriaTitle}>{categoria}</Text>
                            {/* Resumen de cantidades por unidad */}
                            {Object.keys(resumen).length > 0 && (
                                <View style={{ marginBottom: 8, marginTop: 2 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#1e40af', fontSize: 14 }}>Resumen:</Text>
                                    {Object.entries(resumen).map(([unidad, suma]) => (
                                        <Text key={unidad} style={{ color: '#1e293b', fontSize: 14, marginLeft: 8 }}>
                                            {suma} {unidad}
                                        </Text>
                                    ))}
                                </View>
                            )}
                            {templateItems.map((item) => {
                                const formItem: ItemCantidad = itemsToShow.find((it) => it.itemId === item.id) ?? {
                                    itemId: item.id,
                                    cantidad: 0,
                                    volDesechos: 0,
                                    nViajes: 0,
                                    nHoras: 0,
                                    dosis: 0,
                                    ubicacion: '',
                                    lote: '',
                                    dateVencimiento: ''
                                };
                                const { isServiceCategory, isSpecialCategory, isPlagueCategory, isProductPlagueCategory } = getCategoryType(categoria);
                                const isServicio = isCheckboxItem(item.name, categoria, item.unidad);
                                
                                return (
                                    <View key={item.id} style={styles.itemRow}>
                                        <View style={styles.itemRowTop}>
                                            <Text style={styles.itemName} className='uppercase'>{item.name}</Text>
                                            <Text style={styles.itemMeta}>{formatearUnidad(item.unidad)}</Text>
                                        </View>
                                        
                                        {isServicio ? (
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Seleccionado:</Text>
                                                <Text style={{ 
                                                    color: formItem.cantidad ? '#22c55e' : '#ef4444', 
                                                    fontWeight: 'bold', 
                                                    fontSize: 18,
                                                    textAlign: 'center',
                                                    minWidth: 30
                                                }}>
                                                    {formItem.cantidad ? '✓' : '✗'}
                                                </Text>
                                            </View>
                                        ) : isPlagueCategory ? (
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Nivel:</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                                    {getPlagueNivelText(formItem.cantidad || 0)}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Cantidad:</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formItem.cantidad === 0 ? '---' : formItem.cantidad}</Text>
                                            </View>
                                        )}
                                        
                                        {/* Campos adicionales para producto control de plagas */}
                                        {isProductPlagueCategory && (
                                            <>
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>Dosis:</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formItem.dosis === 0 ? '---' : (formItem.dosis || '---')}</Text>
                                                </View>
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>Ubicación:</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formItem.ubicacion || '-'}</Text>
                                                </View>
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>Lote:</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formItem.lote || '-'}</Text>
                                                </View>
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>F.vto:</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                                        {formItem.dateVencimiento ? formatDateForDisplay(formItem.dateVencimiento) : '-'}
                                                    </Text>
                                                </View>
                                            </>
                                        )}
                                        
                                        {/* Campos especiales */}
                                        {isSpecialCategory && (
                                            <>
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>Vol. Desechos:</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formItem.volDesechos === 0 ? '---' : formItem.volDesechos}</Text>
                                                </View>
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>N° Viajes:</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formItem.nViajes === 0 ? '---' : formItem.nViajes}</Text>
                                                </View>
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>N° Minutos:</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formItem.nHoras === 0 ? '---' : formItem.nHoras}</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    }

    // Modo edición (por defecto)
    return (
        <View className="my-4">
            <Text className="mb-2 text-lg font-bold text-azul">Plantilla de Manifiesto</Text>
            {/* Error de plantilla */}
            {errores?.manifestTemplateId ? <FieldError error={errores.manifestTemplateId} /> : null}
            {showList ? (
                <View className={`grid ${isTablet ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    {templateList.map((template) => (
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
                    {Object.entries(groupByCategoria(selectedTemplate.items)).map(([categoria, items]) => {
                        // Resumen por unidad en modo edición
                        const resumen = getResumenPorUnidad(items, categoria, form.items || []);
                        return (
                            <View key={categoria} style={styles.categoriaBlock}>
                                <Text style={styles.categoriaTitle}>{categoria}</Text>
                                {Object.keys(resumen).length > 0 && (
                                    <View style={{ marginBottom: 8, marginTop: 2 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#1e40af', fontSize: 14 }}>Resumen:</Text>
                                        {Object.entries(resumen).map(([unidad, suma]) => (
                                            <Text key={unidad} style={{ color: '#1e293b', fontSize: 14, marginLeft: 8 }}>
                                                {suma} {unidad}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                                {items.map((item) => {
                                    // Buscar el item correspondiente en form.items, siempre del tipo ItemCantidad
                                    const formItem: ItemCantidad = (form.items || []).find((it) => it.itemId === item.id) ?? {
                                        itemId: item.id,
                                        cantidad: 0,
                                        volDesechos: 0,
                                        nViajes: 0,
                                        nHoras: 0,
                                        dosis: 0,
                                        ubicacion: '',
                                        lote: '',
                                        dateVencimiento: ''
                                    };
                                    
                                    const { isServiceCategory, isSpecialCategory, isPlagueCategory, isProductPlagueCategory } = getCategoryType(categoria);
                                    const isServicio = isCheckboxItem(item.name, categoria, item.unidad);
                                    
                                    return (
                                        <View key={item.id} style={styles.itemRow}>
                                            <View style={styles.itemRowTop}>
                                                <Text style={styles.itemName} className='uppercase'>{item.name}</Text>
                                                <Text style={styles.itemMeta}>{formatearUnidad(item.unidad)}</Text>
                                            </View>
                                            
                                            {/* Campo principal: cantidad, checkbox o selector de nivel */}
                                            {isServicio ? (
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>Seleccionar:</Text>
                                                    <Switch
                                                        value={!!formItem.cantidad}
                                                        onValueChange={checked => handleCheckboxChange(item.id, checked)}
                                                    />
                                                </View>
                                            ) : isPlagueCategory ? (
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>Nivel:</Text>
                                                    <TouchableOpacity 
                                                        style={styles.selectButton}
                                                        onPress={() => handlePlagueModalOpen(item.id)}
                                                    >
                                                        <Text style={styles.selectButtonText}>
                                                            {getPlagueNivelText(formItem.cantidad || 0)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.inputLabel}>Cantidad:</Text>
                                                    <TextInput
                                                        style={styles.inputNumber}
                                                        keyboardType="decimal-pad"
                                                        value={inputValues[`${item.id}_cantidad`] ?? (formItem.cantidad && formItem.cantidad > 0 ? formItem.cantidad.toString() : '')}
                                                        onChangeText={(v) => handleInputChange(item.id, 'cantidad', v)}
                                                        onBlur={() => handleInputBlur(item.id, 'cantidad')}
                                                        placeholder="0"
                                                        inputMode="decimal"
                                                    />
                                                </View>
                                            )}
                                            
                                            {/* Campos adicionales para producto control de plagas */}
                                            {isProductPlagueCategory && (
                                                <>
                                                    <View style={styles.inputGroup}>
                                                        <Text style={styles.inputLabel}>Dosis:</Text>
                                                        <TextInput
                                                            style={styles.inputNumber}
                                                            keyboardType="decimal-pad"
                                                            value={inputValues[`${item.id}_dosis`] ?? (formItem.dosis && formItem.dosis > 0 ? formItem.dosis.toString() : '')}
                                                            onChangeText={(v) => handleInputChange(item.id, 'dosis', v)}
                                                            onBlur={() => handleInputBlur(item.id, 'dosis')}
                                                            placeholder="0.0"
                                                            inputMode="decimal"
                                                        />
                                                    </View>
                                                    <View style={styles.inputGroup}>
                                                        <Text style={styles.inputLabel}>Ubicación:</Text>
                                                        <TextInput
                                                            style={styles.inputNumber}
                                                            value={formItem.ubicacion || ''}
                                                            onChangeText={(v) => handleTextFieldChange(item.id, 'ubicacion', v)}
                                                            placeholder="Ubicación"
                                                        />
                                                    </View>
                                                    <View style={styles.inputGroup}>
                                                        <Text style={styles.inputLabel}>Lote:</Text>
                                                        <TextInput
                                                            style={styles.inputNumber}
                                                            value={formItem.lote || ''}
                                                            onChangeText={(v) => handleTextFieldChange(item.id, 'lote', v)}
                                                            placeholder="Lote"
                                                        />
                                                    </View>
                                                    <View style={styles.inputGroup}>
                                                        <Text style={styles.inputLabel}>F.vto:</Text>
                                                        <TouchableOpacity
                                                            style={styles.selectButton}
                                                            onPress={() => handleDatePickerOpen(item.id)}
                                                        >
                                                            <Text style={styles.selectButtonText}>
                                                                {formatDateForDisplay(formItem.dateVencimiento || '')}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </>
                                            )}
                                            
                                            {/* Campos especiales */}
                                            {isSpecialCategory && (
                                                <>
                                                    <View style={styles.inputGroup}>
                                                        <Text style={styles.inputLabel}>Vol. Desechos:</Text>
                                                        <TextInput
                                                            style={styles.inputNumber}
                                                            keyboardType="decimal-pad"
                                                            value={inputValues[`${item.id}_volDesechos`] ?? (formItem.volDesechos && formItem.volDesechos > 0 ? formItem.volDesechos.toString() : '')}
                                                            onChangeText={(v) => handleInputChange(item.id, 'volDesechos', v)}
                                                            onBlur={() => handleInputBlur(item.id, 'volDesechos')}
                                                            placeholder="0"
                                                            inputMode="decimal"
                                                        />
                                                    </View>
                                                    <View style={styles.inputGroup}>
                                                        <Text style={styles.inputLabel}>N° Viajes:</Text>
                                                        <TextInput
                                                            style={styles.inputNumber}
                                                            keyboardType="decimal-pad"
                                                            value={inputValues[`${item.id}_nViajes`] ?? (formItem.nViajes && formItem.nViajes > 0 ? formItem.nViajes.toString() : '')}
                                                            onChangeText={(v) => handleInputChange(item.id, 'nViajes', v)}
                                                            onBlur={() => handleInputBlur(item.id, 'nViajes')}
                                                            placeholder="0"
                                                            inputMode="decimal"
                                                        />
                                                    </View>
                                                    <View style={styles.inputGroup}>
                                                        <Text style={styles.inputLabel}>N° Minutos:</Text>
                                                        <TextInput
                                                            style={styles.inputNumber}
                                                            keyboardType="decimal-pad"
                                                            value={inputValues[`${item.id}_nHoras`] ?? (formItem.nHoras && formItem.nHoras > 0 ? formItem.nHoras.toString() : '')}
                                                            onChangeText={(v) => handleInputChange(item.id, 'nHoras', v)}
                                                            onBlur={() => handleInputBlur(item.id, 'nHoras')}
                                                            placeholder="0"
                                                            inputMode="decimal"
                                                        />
                                                    </View>
                                                </>
                                            )}
                                        </View>
                                    );
                                })}
                                {/* Error general de items */}
                                {errores?.items ? <FieldError error={errores.items} /> : null}
                            </View>
                        );
                    })}
                </View>
            ) : null}
            
            {/* Modal para selección de nivel de plagas */}
            <Modal
                visible={plagueModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPlagueModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Seleccionar Nivel</Text>
                        <FlatList
                            data={plagueNivelesOptions}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalOption}
                                    onPress={() => handlePlagueNivelSelect(item.value)}
                                >
                                    <Text style={styles.modalOptionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setPlagueModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* DateTimePicker para fecha de vencimiento */}
            {datePickerVisible && (
                <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDatePickerChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 2,
    },
    inputLabel: {
        minWidth: 80,
        color: '#374151',
        fontSize: 13,
        marginRight: 6,
    },
    inputNumber: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        fontSize: 15,
        color: '#1e293b',
    },
    selectButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    selectButtonText: {
        fontSize: 15,
        color: '#1e293b',
        textAlign: 'center',
    },
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
    // Estilos para el modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e40af',
        textAlign: 'center',
        marginBottom: 16,
    },
    modalOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#374151',
        textAlign: 'center',
    },
    modalCloseButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fee2e2',
        borderRadius: 6,
        alignSelf: 'center',
    },
    modalCloseText: {
        color: '#dc2626',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SelectTemplate;
