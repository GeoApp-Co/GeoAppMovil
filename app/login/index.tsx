import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../../services/authService';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function LoginScreen() {
    const router = useRouter();
    const toast = useToast();
    const { setToken } = useAuthStore();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
        defaultValues: { 
            cc: '', 
            password: '' 
        },
    });
    

    const {mutate, isPending,} = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            if (data) {
                setToken(data); 
            }
            toast.show('Inicio de sesión exitoso', { type: 'success' });
            router.replace('/');
        },
        onError: (data) => {
            const msg = data.message || 'Error de autenticación';
            toast.show(msg, { type: 'danger' });
        },
    });
    

    const onSubmit = (formData: LoginFormType) => {
        mutate({ loginForm: formData });
    };

    return (
        <KeyboardAvoidingView 
            className="items-center justify-center flex-1 w-full px-4"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View className="w-full p-8 bg-white shadow-2xl rounded-2xl md:p-16 md:max-w-2xl">
                {/* Logo arriba del título */}
                <View className="items-center mb-8 md:mb-12">
                    <Image
                        source={require('../../assets/GeoLogo.png')}
                        className="md:w-[500px] md:h-[240px] w-[320px] h-[110px]"
                        resizeMode="contain"
                    />
                </View>
                <Text className="mb-8 text-3xl font-bold text-center md:text-5xl text-azul">Iniciar Sesión</Text>
                <Controller
                    control={control}
                    name="cc"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className="w-full px-6 py-5 mb-6 text-xl border border-gray-300 md:text-2xl bg-gray-50 rounded-2xl"
                            placeholder="Número de Identidad"
                            value={value}
                            onChangeText={onChange}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholderTextColor="#94a3b8"
                        />
                    )}
                />
                {errors.cc && <Text className="mb-2 text-red-500">{errors.cc.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className="w-full px-6 py-5 mb-6 text-xl border border-gray-300 md:text-2xl bg-gray-50 rounded-2xl"
                            placeholder="Contraseña"
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                            placeholderTextColor="#94a3b8"
                        />
                    )}
                />
                {errors.password && <Text className="mb-2 text-red-500">{errors.password.message}</Text>}

                <TouchableOpacity
                    className={`w-full py-5 rounded-2xl bg-azul mt-4 md:py-7 ${isPending ? 'opacity-60' : ''}`}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                >
                    <Text className="text-xl font-bold text-center text-white md:text-2xl">
                        {isPending ? 'Ingresando...' : 'Ingresar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}



import { Controller } from 'react-hook-form';
import { LoginFormType } from '../../types/userType';
import { loginSchema } from '../../schema/userSchema';
import { useToast } from 'react-native-toast-notifications';
import { Image } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default LoginScreen;
