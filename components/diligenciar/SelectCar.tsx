import React, { use, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDiligenciarFormStore } from '../../store/diligenciarFormStore';
import { useQuery } from '@tanstack/react-query';
import { getCars } from '../../services/carService';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';


function SelectCar() {
    const { cars, setCars, saveLocalCars, form, setForm, refreshCars } = useDiligenciarFormStore();
    const { isConnected, isInternetReachable } = useNetworkStatus();
    const [showList, setShowList] = useState(form.carId == null);

    const { data } = useQuery({
        queryKey: ['cars'],
        queryFn: () => getCars(),
        enabled: isConnected && isInternetReachable
    });

    const handleSeletedCar = (id: number) => {
        setForm({ carId: id });
        setShowList(false);
    }

    const handleDeleteSeletedCar = () => {
        setForm({ carId: null });
        setShowList(true);
    }

    useEffect(() => {
        refreshCars();
    }, []);

    useEffect(() => {
        if (data) {
            setCars(data.cars);
            saveLocalCars();
        }
    }, [data]);

    // Cuando cambia la selección, mostrar u ocultar lista
    useEffect(() => {
        setShowList(form.carId == null);
    }, [form.carId]);

    const selectedCar = cars.find((c) => c.id === form.carId);

    return (
        <View className="my-4">
            <Text className="mb-2 text-lg font-bold text-azul">Placa de Vehículo</Text>
            {showList ? (
                <ScrollView
                    className="bg-white border border-gray-200 rounded-lg shadow-sm"
                    style={{ maxHeight: 256 }}
                    contentContainerStyle={{ paddingVertical: 0 }}
                    nestedScrollEnabled={true}
                >
                    {cars.length === 0 ? (
                        <Text className="p-4 text-gray-500">No hay carros disponibles</Text>
                    ) : (
                        cars.map((car) => (
                            <TouchableOpacity
                                key={car.id}
                                className="p-4 border-b border-gray-100 active:bg-blue-100"
                                onPress={() => handleSeletedCar(car.id)}
                            >
                                <Text className="text-base text-gray-800">{car.plate}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            ) : (
                <View className="flex-row items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-azul">{selectedCar?.plate || 'Carro seleccionado'}</Text>
                    </View>
                    <TouchableOpacity
                        className="px-3 py-1 ml-4 bg-red-100 border border-red-300 rounded"
                        onPress={handleDeleteSeletedCar}
                    >
                        <Text className="font-bold text-red-600">Limpiar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default SelectCar;
