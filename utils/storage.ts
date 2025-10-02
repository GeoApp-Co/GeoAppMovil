import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
};

export const getItem = async (key: string) => {
    return await AsyncStorage.getItem(key);
};

export const removeItem = async (key: string) => {
    await AsyncStorage.removeItem(key);
};

// Función utilitaria para obtener y parsear cualquier dato de AsyncStorage con un schema
export async function getParsedItem<T>(key: string, schema: any): Promise<T | null> {
    const str = await getItem(key);
    if (!str) return null;
    try {
        const parsed = JSON.parse(str);
        const result = schema.safeParse(parsed);
        if (result.success) {
            return result.data;
        }
        return null;
    } catch {
        return null;
    }
}