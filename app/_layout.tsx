import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Slot} from 'expo-router'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import "../global.css";
import SideBar from '../components/SideBar'
import { ToastProvider } from 'react-native-toast-notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth'


const queryClient = new QueryClient();

function _layout() {
    const insets = useSafeAreaInsets();
    const {hydrate} = useAuth()

    useEffect(() => {
        hydrate();
    }, []);
    
    return (
        <SafeAreaProvider>
            {/* Header fijo */}
            <QueryClientProvider client={queryClient}>
                <SideBar/>
                {/* Contenido principal */}
                <View style={{ paddingBottom: insets.bottom, paddingTop: insets.top + 56 }} className="items-center justify-center flex-1 w-full px-4 bg-white md:px-12">
                    <StatusBar style="auto" />
                    <ToastProvider>
                        <Slot/>
                    </ToastProvider>
                </View>
            </QueryClientProvider>
        </SafeAreaProvider>
    )
}

export default _layout

