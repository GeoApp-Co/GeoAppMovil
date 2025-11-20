import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const menuOptions = [
    {
        title: 'Diligenciar Manifiesto',
        description: 'Llena y gestiona formularios de manifiestos',
        url: '/diligenciar', // Cambia por navegación interna si usas React Navigation
    },
    {
        title: 'Lista de Servicios/Manifiestos Locales',
        description: 'Administra los manifiestos / servicios locales',
        url: '/manifiestosLocales', // Cambia por navegación interna si usas React Navigation
    },
    {
        title: 'Lista de Servicios/Manifiestos en Línea',
        description: 'Administra los manifiestos / servicios creados',
        url: '/manifiestos', // Cambia por navegación interna si usas React Navigation
    },
];

type MenuCardProps = {
    title: string;
    description: string;
    index?: number;
    url: string;
}

function MenuCard({ title, description, index = 0, url } : MenuCardProps) {
    const color = index % 2 === 0 ? 'bg-azul' : 'bg-verde';
    return (
        <Link
            href={url}
            className={`flex-row items-center p-6 md:p-12 shadow-2xl rounded-2xl max-w-full md:max-w-[600px] ${color} w-full`}
        >
            <View className="flex-1">
                <Text className="text-xl font-bold text-white md:text-3xl">{title}</Text>
                <Text className="mt-2 text-base text-white md:mt-4 md:text-xl">{description}</Text>
            </View>
        </Link>
    );
}

export default function Main() {
    const insets = useSafeAreaInsets();
    return (
        <View>
            {/* Logo */}
            <View className="items-center mb-8 md:mb-12">
                <Image
                    source={require('../assets/GeoLogo.png')}
                    // style={{ minWidth: 300, minHeight: 100, maxWidth: 600, maxHeight: 200 }}
                    className="md:w-[600px] md:h-[200px] w-[300px] h-[100px]"
                    resizeMode="contain"
                />
            </View>

            <Text className="mb-8 text-2xl font-bold text-center md:mb-12 md:text-5xl text-azul">Menú Principal</Text>
            {/* Cards menú dinámicas */}
            <View className="grid items-center grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                {menuOptions.map((option, idx) => (
                    <MenuCard key={idx} {...option} index={idx} />
                ))}
            </View>
        </View>
    );
}

