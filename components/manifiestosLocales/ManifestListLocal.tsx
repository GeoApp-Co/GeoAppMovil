import React, { useEffect } from 'react'
import { FlatList, Text, View, TouchableOpacity } from 'react-native'
import { DiligenciarFormData } from '../../types/manifestType'
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm'
import { formatDateTime } from '../../utils/date'

type ManifestListLocalProps = {
    manifestsLocales: DiligenciarFormData[]
}

import { useRouter } from 'expo-router';

const ManifestPreviewCard = ({ manifest } : { manifest: DiligenciarFormData }) => {
    const { clientes, templates } = useDiligenciarForm();
    const router = useRouter();
    const cliente = clientes.find(c => c.id === manifest.clientId) || { alias: 'Desconocido' };
    const manifestTemplate = templates.find(t => t.id === manifest.manifestTemplateId) || { name: 'Desconocido' };

    const handleNavigateViewManifestLocal = () => {
        router.push(`/manifiestosLocales/${manifest.id}/view`);
    }

    return (
        <TouchableOpacity
            key={manifest.id}
            className="p-4 my-2 border rounded-2xl border-azul md:p-6"
            style={{ minWidth: 160 }}
            onPress={handleNavigateViewManifestLocal}
            activeOpacity={0.85}
        >
            <Text className="mb-1 text-lg font-bold truncate text-azul md:text-xl">{cliente.alias}</Text>
            <Text className="mb-1 text-xs text-azul md:text-base">Plantilla</Text>
            <Text className="mb-1 text-xs font-bold text-azul md:text-base ">{manifestTemplate.name}</Text>
            <Text className="mb-1 text-xs font-semibold text-verde md:text-base">
                Fecha: {formatDateTime(typeof manifest.date === 'string' ? manifest.date : manifest.date.toISOString())}
            </Text>
        </TouchableOpacity>
    );
};


function ManifestListLocal( { manifestsLocales } : ManifestListLocalProps) {

    const { refreshManifestLocales, refreshClientes, refreshTemplates} = useDiligenciarForm()

    useEffect(() => {
        refreshManifestLocales()
        refreshClientes()
        refreshTemplates()
    }, [])
    // Ordenar por fecha inicial descendente
    const sortedManifests = [...manifestsLocales].sort((a, b) => {
        const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
        const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
        return dateB.getTime() - dateA.getTime();
    });
    return (
        <View  className="flex-1 w-full mt-6">
            <FlatList
                data={sortedManifests}
                keyExtractor={(item) => item.id?.toString?.() || ''}
                renderItem={({ item }) => <ManifestPreviewCard manifest={item} />}
                className="flex flex-col flex-1 w-full gap-4 md:grid md:grid-cols-2"
                contentContainerStyle={{ paddingBottom: 32 }}
            />
        </View>
    )
}

export default ManifestListLocal
