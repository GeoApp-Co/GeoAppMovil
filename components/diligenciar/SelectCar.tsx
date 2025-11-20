import React, { use, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDiligenciarFormStore } from '../../store/diligenciarFormStore';
import FieldError from './FieldError';
import { useQuery } from '@tanstack/react-query';
import { getCars } from '../../services/carService';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

type SelectCarProps = {
    plateId?: number | null | undefined;
    readOnly?: boolean;
}

function SelectCar({ plateId, readOnly = false }: SelectCarProps) {
    const { cars, setCars, saveLocalCars, form, setForm, refreshCars, errores } = useDiligenciarFormStore();
    const { isConnected, isInternetReachable } = useNetworkStatus();
    // Si es readOnly, siempre mostrar el carro seleccionado
    const [showList, setShowList] = useState(readOnly ? false : form.plateId == null);

    // Solo consulta si no hay carros locales
    const { data, isLoading, error } = useQuery({
        queryKey: ['cars'],
        queryFn: () => getCars(),
        enabled: !!(isConnected && isInternetReachable && cars.length === 0),
        retry: false,
    });
    // Siempre usa el store local
    const carList = cars;

    const handleSeletedCar = (id: number) => {
        if (readOnly) return;
        setForm({ plateId: id });
        setShowList(false);
    };

    const handleDeleteSeletedCar = () => {
        if (readOnly) return;
        setForm({ plateId: null });
        setShowList(true);
    };

    useEffect(() => {
        refreshCars();
    }, []);

    useEffect(() => {
        if (data && data.cars && data.cars.length > 0) {
            setCars(data.cars);
            saveLocalCars();
        }
    }, [data]);

    // Cuando cambia la selección, mostrar u ocultar lista
    useEffect(() => {
        if (!readOnly) {
            setShowList(form.plateId == null);
        }
    }, [form.plateId, readOnly]);

    // Si es readOnly, usar el plateId prop, si no, usar el del form
    const selectedCar = carList.find((c) => c.id === (readOnly ? plateId : form.plateId));

    if (isLoading && carList.length === 0) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">Cargando carros...</Text>
            </View>
        );
    }

    if (!carList || carList.length === 0) {
        return (
            <View className="p-4 my-4 bg-white border border-gray-200 rounded-lg">
                <Text className="text-gray-500">No hay carros disponibles</Text>
            </View>
        );
    }

    return (
        <View className="my-4">
            <Text className="mb-2 text-lg font-bold text-azul">Placa de Vehículo</Text>
            {errores?.plateId && !readOnly ? <FieldError error={errores.plateId} /> : null}
            {showList && !readOnly ? (
                <ScrollView
                
                    className="bg-white border border-gray-200 rounded-lg shadow-sm"
                    style={{ maxHeight: 256 }}
                    contentContainerStyle={{ paddingVertical: 0 }}
                    nestedScrollEnabled={true}
                >
                    {carList.length === 0 ? (
                        <Text className="p-4 text-gray-500">No hay carros disponibles</Text>
                    ) : (
                        carList.map((car) => (
                            <TouchableOpacity
                                key={car.id}
                                className="p-4 border-b border-gray-100 active:bg-blue-100"
                                onPress={() => handleSeletedCar(car.id)}
                                disabled={readOnly}
                            >
                                <Text className="text-base text-gray-800">{car.plate.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            ) : (
                <View className="flex-row items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-azul">{selectedCar?.plate.toUpperCase() || 'Carro seleccionado'}</Text>
                    </View>
                    {!readOnly && (
                        <TouchableOpacity
                            className="px-3 py-1 ml-4 bg-red-100 border border-red-300 rounded"
                            onPress={handleDeleteSeletedCar}
                        >
                            <Text className="font-bold text-red-600">Limpiar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

export default SelectCar;
