import React from 'react';
import { Text, TextInput, View, ScrollView, Platform, Dimensions, Button, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';
import SelectCar from '../../components/diligenciar/SelectCar';
import SelectTemplate from '../../components/diligenciar/SelectTemplate';

function DiligenciarForm() {
    const isTablet = Dimensions.get('window').width >= 768;

    const {
        form,
        setForm,
        resetForm,
    } = useDiligenciarForm();

    const [mode, setMode] = React.useState<'date' | 'time'>('date');
    const [show, setShow] = React.useState(false);
    const [showFinal, setShowFinal] = React.useState(false);

    const onChangeDate = (event: { type: string }, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) setForm({ date: selectedDate });
    };
    const onChangeDateFinal = (event: { type: string }, selectedDate?: Date) => {
        setShowFinal(false);
        if (selectedDate) setForm({ dateFinal: selectedDate });
    };

    const showDatepicker = () => {
        setMode('date');
        setShow(true);
    };
    const showTimepicker = () => {
        setMode('time');
        setShow(true);
    };
    const showDatepickerFinal = () => {
        setMode('date');
        setShowFinal(true);
    };
    const showTimepickerFinal = () => {
        setMode('time');
        setShowFinal(true);
    };

    const handleSubmit = () => {
        console.log(form);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ flex: 1, padding: isTablet ? 32 : 16 }}>
                <Text style={{ fontSize: isTablet ? 32 : 24, fontWeight: 'bold', color: '#1e40af', textAlign: 'center', marginBottom: isTablet ? 24 : 16 }}>
                    Diligenciar Manifiesto
                </Text>

                {/* Carros */}
                <SelectCar/>

                {/* Ubicación */}
                <View style={{ marginBottom: isTablet ? 24 : 16 }}>
                    <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 4, fontSize: isTablet ? 20 : 16 }}>Lugar</Text>
                    <TextInput
                        value={form.location}
                        onChangeText={text => setForm({ location: text })}
                        placeholder="Lugar del servicio"
                        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: isTablet ? 16 : 10, backgroundColor: '#fff', fontSize: isTablet ? 18 : 14 }}
                    />
                </View>

                {/* Fecha Inicial */}
                <View style={{ marginBottom: isTablet ? 24 : 16 }}>
                    <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 4, fontSize: isTablet ? 20 : 16 }}>Fecha Inicial</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Button onPress={showDatepicker} title="Seleccionar fecha" />
                        <Button onPress={showTimepicker} title="Seleccionar hora" />
                    </View>
                    <Text style={{ marginTop: 8, fontSize: isTablet ? 18 : 14 }}>Seleccionado: {form.date.toLocaleString()}</Text>
                    {show && (
                        <DateTimePicker
                            value={form.date}
                            mode={mode}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={onChangeDate}
                        />
                    )}
                </View>

                {/* Fecha Final */}
                <View style={{ marginBottom: isTablet ? 24 : 16 }}>
                    <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 4, fontSize: isTablet ? 20 : 16 }}>Fecha Final</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Button onPress={showDatepickerFinal} title="Seleccionar fecha" />
                        <Button onPress={showTimepickerFinal} title="Seleccionar hora" />
                    </View>
                    <Text style={{ marginTop: 8, fontSize: isTablet ? 18 : 14 }}>Seleccionado: {form.dateFinal.toLocaleString()}</Text>
                    {showFinal && (
                        <DateTimePicker
                            value={form.dateFinal}
                            mode={mode}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={onChangeDateFinal}
                        />
                    )}
                </View>

                <SelectTemplate />

                {/* Observaciones */}
                <View style={{ marginBottom: isTablet ? 24 : 16 }}>
                    <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 4, fontSize: isTablet ? 20 : 16 }}>Observaciones</Text>
                    <TextInput
                        value={form.observations}
                        onChangeText={text => setForm({ observations: text })}
                        placeholder="Observaciones..."
                        multiline
                        numberOfLines={isTablet ? 8 : 4}
                        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: isTablet ? 16 : 10, backgroundColor: '#fff', textAlignVertical: 'top', fontSize: isTablet ? 18 : 14, minHeight: isTablet ? 160 : 80 }}
                    />
                </View>

                <View style={{ marginTop: isTablet ? 32 : 24 }}>
                    <Button onPress={handleSubmit} title="Guardar" color="#22c55e" />
                </View>
            </ScrollView>
        </View>
    );
}

export default DiligenciarForm;
