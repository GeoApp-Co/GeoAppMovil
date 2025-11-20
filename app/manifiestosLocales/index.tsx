import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm'
import ManifestListLocal from '../../components/manifiestosLocales/ManifestListLocal'

function Index() {

    const { refreshManifestLocales, manifestLocales, refreshCars, refreshTemplates, refreshClientes} = useDiligenciarForm()


    useEffect(() => {
        refreshManifestLocales()
        refreshCars()
        refreshTemplates()
        refreshClientes()
    }, [])

    // console.log('manifiestosLocales',manifestLocales.map(m => m.clientId));

    return (
        <View style={{ flex: 1 }} className="w-full min-h-screen px-2 py-4 mt-20 md:px-12 md:py-8">
            <Text className="mb-4 text-2xl font-extrabold text-center md:text-4xl text-azul">Lista de Servicios/Manifiestos Locales</Text>

            { manifestLocales.length === 0 && <Text className="mt-4 font-bold text-center text-azul">No hay manifiestos disponibles.</Text>}

            { manifestLocales.length > 0 && 
                <ManifestListLocal 
                    manifestsLocales={manifestLocales} 
                />
            }

            
        </View>
    )
}

export default Index
