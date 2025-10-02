
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { usePathname, useRouter } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../services/authService';
import { useEffect } from 'react';
import { removeItem } from '../utils/storage';
import { useManifest } from '../hooks/useManifest';


function SideBar() {

    const { logout, token, user, setAuth } = useAuth();
    const { clearManifests } = useManifest();
    const { isConnected, isInternetReachable } = useNetworkStatus();

    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const { data, isLoading, error, refetch} = useQuery({
        queryKey: ['authStatus', token],
        queryFn: () => getUser(),
        enabled: !!token && isConnected && isInternetReachable,
        refetchOnWindowFocus: false,
    })
    
    const handleLogout = () => {
        if (!isConnected || !isInternetReachable) return;
        logout();
        clearManifests();
        router.replace('/');
    };

    const handleNavigateLogin = () => {
        if (!isConnected || !isInternetReachable) return;
        router.replace('/login');
    }
    const handleGoHome = () => {
        router.replace('/');
    };

    const showGoHome = pathname !== '/';

    useEffect(() => {
        if (data) {
            setAuth();
        }
    }, [data])
    
    useEffect(() => {
        if (token) {
            refetch();
        }
    }, [token]);
    
    // Obtener el primer nombre del usuario si existe
    let firstName = '';
    if (user && user.name) {
        firstName = user.name.split(' ')[0];
    }


    return (
        <View style={{ position: 'absolute', top: 10, left: 0, right: 0, zIndex: 50, paddingTop: insets.top }} className="flex-row items-center justify-between w-full px-4 py-2 bg-gray-100 border-b border-gray-300 md:px-12 md:py-4">
            <View className="flex-row items-center space-x-4">
                {showGoHome && (
                    <TouchableOpacity onPress={handleGoHome} className="p-2 rounded-xl bg-azul">
                        <FontAwesome name="home" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
            {/* Nombre centrado si está logueado */}
            <View className="items-center justify-center flex-1">
                {token && user && firstName ? (
                    <>
                        {/* Móvil: solo primer nombre */}
                        <Text
                            className="text-xl font-bold truncate md:hidden text-azul"
                        >
                            {firstName}
                        </Text>
                        {/* Tablet: Bienvenido, primer nombre */}
                        <Text
                            className="hidden text-sm font-bold truncate md:block text-azul"
                        >
                            {`Bienvenido, ${firstName}`}
                        </Text>
                    </>
                ) : null}
            </View>
            {/* Mostrar spinner si está cargando */}
            {isLoading ? (
                <View className="flex-row items-center p-2">
                    <FontAwesome name="spinner" size={24} color="#2563eb" style={{}} />
                </View>
            ) : token ? (
                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center p-2 bg-red-500 rounded-xl"
                    disabled={!isConnected || !isInternetReachable}
                    style={{ opacity: (!isConnected || !isInternetReachable) ? 0.5 : 1 }}
                >
                    <FontAwesome name="sign-out" size={24} color="#fff" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={handleNavigateLogin}
                    className="flex-row items-center p-2 bg-azul rounded-xl"
                    disabled={!isConnected || !isInternetReachable}
                    style={{ opacity: (!isConnected || !isInternetReachable) ? 0.5 : 1 }}
                >
                    <FontAwesome name="sign-in" size={24} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    )
    
}

export default SideBar
