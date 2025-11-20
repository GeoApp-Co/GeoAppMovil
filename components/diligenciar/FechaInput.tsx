import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import { formatearFechaBonita } from '../../utils/transformData';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';
import FieldError from './FieldError';

type FechaInputProps = {
    date?: Date | undefined
    dateFinal?: Date | undefined
    readOnly?: boolean
}

function FechaInput( { date, dateFinal, readOnly = false }: FechaInputProps) {
    const isTablet = Dimensions.get('window').width >= 768;

    const { setForm, form, errores } = useDiligenciarForm()

    const [mode, setMode] = React.useState<'date' | 'time'>('date');
    const [show, setShow] = React.useState(readOnly ? false : form.date == null);
    const [showFinal, setShowFinal] = React.useState(readOnly ? false : form.dateFinal == null);

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


    return (
        <View>
            {/* Fecha Inicial */}
            <View style={{ marginBottom: isTablet ? 32 : 16 }}>
                <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 10, fontSize: isTablet ? 22 : 16, textAlign: isTablet ? 'center' : 'left' }}>Fecha Inicial</Text>
                {readOnly ? (
                    <View style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 12, padding: isTablet ? 20 : 10, alignItems: isTablet ? 'center' : 'flex-start', justifyContent: 'center', minHeight: 48 }}>
                        <Text style={{ fontSize: isTablet ? 18 : 14, color: '#334155', fontFamily: 'Raleway-Medium', textAlign: isTablet ? 'center' : 'left' }}>
                            {date ? formatearFechaBonita(date) : formatearFechaBonita(form.date)}
                        </Text>
                    </View>
                ) : (
                    <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: isTablet ? 20 : 10, borderWidth: 1, borderColor: '#e5e7eb', alignItems: isTablet ? 'center' : 'stretch' }}>
                        <View style={{ flexDirection: 'row', gap: isTablet ? 20 : 10, justifyContent: isTablet ? 'center' : 'flex-start', marginBottom: 8 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={showDatepicker}
                                style={{
                                    backgroundColor: '#2563eb',
                                    paddingVertical: isTablet ? 12 : 8,
                                    paddingHorizontal: isTablet ? 24 : 14,
                                    borderRadius: 8,
                                    marginRight: isTablet ? 10 : 4,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.10,
                                    shadowRadius: 2,
                                    elevation: 1,
                                }}
                            >
                                <Text style={{ color: '#fff', fontFamily: 'Raleway-Bold', fontSize: isTablet ? 18 : 14 }}>Seleccionar fecha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={showTimepicker}
                                style={{
                                    backgroundColor: '#2563eb',
                                    paddingVertical: isTablet ? 12 : 8,
                                    paddingHorizontal: isTablet ? 24 : 14,
                                    borderRadius: 8,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.10,
                                    shadowRadius: 2,
                                    elevation: 1,
                                }}
                            >
                                <Text style={{ color: '#fff', fontFamily: 'Raleway-Bold', fontSize: isTablet ? 18 : 14 }}>Seleccionar hora</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ marginTop: 8, fontSize: isTablet ? 18 : 14, textAlign: isTablet ? 'center' : 'left', color: '#334155', fontFamily: 'Raleway-Medium' }}>
                            {date ? formatearFechaBonita(date) : formatearFechaBonita(form.date)}
                        </Text>
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
                )}
            </View>

            {/* Fecha Final */}
            <View style={{ marginBottom: isTablet ? 32 : 16 }}>
                <Text style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: 10, fontSize: isTablet ? 22 : 16, textAlign: isTablet ? 'center' : 'left' }}>Fecha Final</Text>
                {readOnly ? (
                    <View style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 12, padding: isTablet ? 20 : 10, alignItems: isTablet ? 'center' : 'flex-start', justifyContent: 'center', minHeight: 48 }}>
                        <Text style={{ fontSize: isTablet ? 18 : 14, color: '#334155', fontFamily: 'Raleway-Medium', textAlign: isTablet ? 'center' : 'left' }}>
                            {dateFinal ? formatearFechaBonita(dateFinal) : formatearFechaBonita(form.dateFinal)}
                        </Text>
                    </View>
                ) : (
                    <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: isTablet ? 20 : 10, borderWidth: 1, borderColor: '#e5e7eb', alignItems: isTablet ? 'center' : 'stretch' }}>
                        <View style={{ flexDirection: 'row', gap: isTablet ? 20 : 10, justifyContent: isTablet ? 'center' : 'flex-start', marginBottom: 8 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={showDatepickerFinal}
                                style={{
                                    backgroundColor: '#2563eb',
                                    paddingVertical: isTablet ? 12 : 8,
                                    paddingHorizontal: isTablet ? 24 : 14,
                                    borderRadius: 8,
                                    marginRight: isTablet ? 10 : 4,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.10,
                                    shadowRadius: 2,
                                    elevation: 1,
                                }}
                            >
                                <Text style={{ color: '#fff', fontFamily: 'Raleway-Bold', fontSize: isTablet ? 18 : 14 }}>Seleccionar fecha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={showTimepickerFinal}
                                style={{
                                    backgroundColor: '#2563eb',
                                    paddingVertical: isTablet ? 12 : 8,
                                    paddingHorizontal: isTablet ? 24 : 14,
                                    borderRadius: 8,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.10,
                                    shadowRadius: 2,
                                    elevation: 1,
                                }}
                            >
                                <Text style={{ color: '#fff', fontFamily: 'Raleway-Bold', fontSize: isTablet ? 18 : 14 }}>Seleccionar hora</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ marginTop: 8, fontSize: isTablet ? 18 : 14, textAlign: isTablet ? 'center' : 'left', color: '#334155', fontFamily: 'Raleway-Medium' }}>
                            {dateFinal ? formatearFechaBonita(dateFinal) : formatearFechaBonita(form.dateFinal)}
                        </Text>
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
                )}
            </View>

            {errores?.dateFinal && !readOnly ? <FieldError error={errores.dateFinal} /> : null}
        </View>
    )
}

export default FechaInput
