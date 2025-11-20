import React from 'react';
import { View, Text, FlatList, TouchableOpacity} from 'react-native';
import { ManifestPreviewType } from '../types/manifestType';
import { formatDateTime } from '../utils/date';
import { useRouter } from 'expo-router';



interface ManifestListProps {
    manifests: ManifestPreviewType[];
}

const ManifestPreviewCard = ({ manifest } : { manifest: ManifestPreviewType }) => {
    const router = useRouter();
    
    const handlePress = () => {
        router.push(`/manifiestos/${manifest.id}/view`);
    };

    return (
        <TouchableOpacity
            key={manifest.id}
            className="p-4 my-2 border rounded-2xl border-azul md:p-6"
            style={{ minWidth: 160 }}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Text className="mb-1 text-lg font-bold truncate text-azul md:text-xl">{manifest.cliente.alias}</Text>
            <Text className="mb-1 text-xs text-azul md:text-base">Plantilla</Text>
            <Text className="mb-1 text-xs font-bold text-azul md:text-base ">{manifest.manifestTemplate.name}</Text>
            <Text className="mb-1 text-xs font-semibold text-verde md:text-base">Fecha: {formatDateTime(manifest.date)}</Text>
        </TouchableOpacity>
    );
};

const ManifestList: React.FC<ManifestListProps> = ({ manifests}) => {
    if (!manifests || manifests.length === 0) {
        return <Text className="mt-4 font-bold text-center text-azul">No hay manifiestos disponibles.</Text>;
    }
    return (
        <View  className="flex-1 w-full mt-6">
            <FlatList
                data={manifests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ManifestPreviewCard manifest={item} />}
                className="flex flex-col flex-1 w-full gap-4 md:grid md:grid-cols-2"
                contentContainerStyle={{ paddingBottom: 32 }}
            />
        </View>
    );
};


export default ManifestList;
