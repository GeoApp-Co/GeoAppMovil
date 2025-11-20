
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Modal, Pressable, useWindowDimensions } from 'react-native';
import { Image, TouchableOpacity } from 'react-native';
import { useDiligenciarForm } from '../../hooks/useDiligenciarForm';
import FieldError from './FieldError';

import SignatureCanvas from 'react-native-signature-canvas';
import { traslateRoles } from '../../utils/transformData';

interface FirmasProps {
	userName: string;
	userRole: string;
	signature?: string;
	signatureClient?: string;
	readOnly?: boolean;
	phone?: string;
	contactClient?: string;
	positionClient?: string;
}

const Firmas: React.FC<FirmasProps> = ({ userName, userRole, signature, signatureClient, readOnly, contactClient, phone, positionClient}) => {
	const { form, setForm, errores } = useDiligenciarForm();
	const { width } = useWindowDimensions();
	const isTablet = width >= 768;
	const ref = useRef<any>(null);

	// const signatureCurrent = signature || form.signature;ÑÑ
	// const signatureClientCurrent = signatureClient || form.signatureClient;

	// Estado para mostrar el modal de firma
	const [modal, setModal] = useState<{ open: boolean; field: 'signature' | 'signatureClient' | null }>
		(
			{ 
				open: readOnly ? false : false, 
				field: null 
			}

		);
	const [isLoading, setIsLoading] = useState(false);

	// Handlers para guardar la firma como base64 PNG
	const handleSaveSignature = (signature: string) => {
		if (modal.field) {
			setForm({ [modal.field]: signature });
		}
		setModal({ open: false, field: null });
		setIsLoading(false);
	};

	const handleEmpty = () => {
		setIsLoading(false);
	};

	const handleClear = () => {
		if (modal.field) {
			setForm({ [modal.field]: null });
		}
	};

	const handleError = (error: any) => {
		console.error('Signature pad error:', error);
		setIsLoading(false);
	};

	// handleEnd ya no cierra el modal ni llama a readSignature
	const handleEnd = () => {
		// Opcional: puedes mostrar un loading si quieres
		setIsLoading(true);
	};

	// Si cancela o retrocede, solo cerrar el modal (no guardar nada)
	const handleCancel = () => {
		setModal({ open: false, field: null });
	};

	const handleDeleteSignature = (field: 'signature' | 'signatureClient') => {
		setForm({ [field]: '' });
	};

	const handleSavecontactClient = (text: string) => {
		setForm({ contactClient: text });
	}

	const handleSavepositionClient = (text: string) => {
		setForm({ positionClient: text });
	}

	const handleSavephone = (text: string) => {
		setForm({ phone: text });
	}

	// Modal de firma
	const renderModal = () => {
		if (!modal.open || !modal.field) return null;
		const field = modal.field;
		const canvasWidth = isTablet ? 600 : 340;
		const canvasHeight = isTablet ? 320 : 180;
		if (readOnly) return null;
		return (
			<Modal
				visible={modal.open}
				animationType="slide"
				transparent={false}
				onRequestClose={handleCancel}
			>
				<View 
					style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 16, paddingTop: '50%', position: 'relative' }}
				>
					<Text style={{ fontWeight: 'bold', fontSize: isTablet ? 28 : 20, color: '#1e40af', marginBottom: 12 }}>
						{field === 'signature' ? 'Firma del Conductor' : 'Firma del Cliente'}
					</Text>
					<SignatureCanvas
						ref={ref}
						onOK={handleSaveSignature}
						onEmpty={handleEmpty}
						onClear={handleClear}
						onError={handleError}
						// onEnd solo muestra loading, no cierra ni lee la firma
						onEnd={handleEnd}
						autoClear={true}
						scrollable={true}
						descriptionText="Firme en el recuadro"
						clearText="Limpiar"
						confirmText="Guardar"
						penColor="#000000"
						backgroundColor="#fff"
						webviewProps={{
							cacheEnabled: true,
						}}
					/>
					<TouchableOpacity
						onPress={handleCancel}
						style={{ paddingVertical: 10, paddingHorizontal: 28, backgroundColor: '#e5e7eb', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginTop: 8 }}
					>
						<Text style={{ color: '#1e293b', fontWeight: 'bold', fontSize: 16 }}>Cancelar</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	};



	return (
		<View>
			{renderModal()}
			{/* Firma del conductor */}
			<View style={styles.firmaBlock}>
				<Text style={styles.label}>Firma del Conductor</Text>
				{signature || form.signature ? (
					<Image
						source={{ uri: signature ? signature : form.signature }}
						style={{ width: '100%', height: 120, backgroundColor: '#fff' }}
						resizeMode="contain"
					/>
				) : (
					<Text style={{ color: '#9ca3af', textAlign: 'center', marginTop: 40 }}>No hay firma registrada</Text>
				)}
				{/* Error de firma conductor */}
				{errores?.signature && !readOnly ? <FieldError error={errores.signature} /> : null}

				{!readOnly && 
					<View style={{ flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12, justifyContent: 'center' }}>
						<TouchableOpacity
							onPress={() => setModal({ open: true, field: 'signature' })}
							style={{ backgroundColor: '#2563eb', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18 }}
						>
							<Text style={{ color: '#fff', fontWeight: 'bold' }}>Firmar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleDeleteSignature('signature')}
							style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', borderWidth: 1, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18 }}
							disabled={!form.signature}
						>
							<Text style={{ color: '#dc2626', fontWeight: 'bold' }}>Limpiar</Text>
						</TouchableOpacity>
					</View>
				}
				<Text style={styles.infoText}>Conductor: {userName}</Text>
				<Text style={styles.infoText}>Cargo: {traslateRoles(userRole)}</Text>
			</View>

			{/* Firma del cliente */}
			<View style={styles.firmaBlock}>
				<Text style={styles.label}>Firma del Cliente</Text>
				{signatureClient || form.signatureClient ? (
					<Image
						source={{ uri: signatureClient ? signatureClient : form.signatureClient }}
						style={{ width: '100%', height: 120, backgroundColor: '#fff' }}
						resizeMode="contain"
					/>
				) : (
					<Text style={{ color: '#9ca3af', textAlign: 'center', marginTop: 40 }}>No hay firma registrada</Text>
				)}
				{/* Error de firma cliente */}
				{errores?.signatureClient && !readOnly ? <FieldError error={errores.signatureClient} /> : null}

				{!readOnly &&
					<View style={{ flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12, justifyContent: 'center' }}>
						<TouchableOpacity
							onPress={() => setModal({ open: true, field: 'signatureClient' })}
							style={{ backgroundColor: '#2563eb', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18 }}
						>
							<Text style={{ color: '#fff', fontWeight: 'bold' }}>Firmar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleDeleteSignature('signatureClient')}
							style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', borderWidth: 1, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18 }}
							disabled={!form.signatureClient}
						>
							<Text style={{ color: '#dc2626', fontWeight: 'bold' }}>Limpiar</Text>
						</TouchableOpacity>
					</View>
				}
				<Text style={styles.infoText}>Nombre del cliente:</Text>
				<TextInput
					style={styles.input}
					value={contactClient ? contactClient : form.contactClient}
					onChangeText={(text) => handleSavecontactClient(text)}
					placeholder="Nombre del contacto"
					placeholderTextColor="#9ca3af"
					returnKeyType="next"
					textContentType="name"
					autoCapitalize="words"
					blurOnSubmit={false}
				/>
				{errores?.contactClient && !readOnly ? <FieldError error={errores.contactClient} /> : null}

				<Text style={styles.infoText}>Cargo del cliente:</Text>
				<TextInput
					style={styles.input}
					value={positionClient ? positionClient : form.positionClient}
					onChangeText={(text) => handleSavepositionClient(text)}
					placeholder="Cargo del contacto"
					placeholderTextColor="#9ca3af"
					returnKeyType="next"
					textContentType="jobTitle"
					autoCapitalize="words"
					blurOnSubmit={false}
				/>
				{errores?.positionClient && !readOnly ? <FieldError error={errores.positionClient} /> : null}
				<Text style={styles.infoText}>Teléfono del cliente:</Text>
				<TextInput
					style={styles.input}
					value={phone ? phone : form.phone}
					onChangeText={(text) => handleSavephone(text)}
					placeholder="Teléfono del contacto"
					placeholderTextColor="#9ca3af"
					keyboardType="phone-pad"
					returnKeyType="done"
					textContentType="telephoneNumber"
					blurOnSubmit={true}
				/>
				{errores?.phone && !readOnly ? <FieldError error={errores.phone} /> : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	firmaBlock: {
		marginBottom: 32,
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	label: {
		fontWeight: 'bold',
		color: '#1e40af',
		fontSize: 16,
		marginBottom: 8,
	},
	signatureBox: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		backgroundColor: '#fff',
		marginBottom: 8,
		overflow: 'hidden',
		height: 130,
	},
	infoText: {
		color: '#374151',
		fontSize: 14,
		marginBottom: 4,
	},
	input: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		padding: 12,
		backgroundColor: '#fff',
		fontSize: 16,
		marginBottom: 12,
		minHeight: 48,
	},
	container: {
    flex: 1,
	},
	preview: {
		width: 335,
		height: 114,
		backgroundColor: '#F8F8F8',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 15,
	},
});

export default Firmas;
