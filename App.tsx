import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './components/Main';
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 mt-7 items-center justify-center bg-white text-blue-800">
        <StatusBar style="auto" />
        <Main/>
      </View>
    </SafeAreaProvider>
  );
}

