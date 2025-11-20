// Genera un id único basado en timestamp y un número aleatorio
export function generateUniqueId(): string {
    return (
        Date.now().toString(36) +
        '-' +
        Math.random().toString(36).substring(2, 10)
    );
}

import { diligenciarFormSchema } from '../schema/manifestSchema';
import { DiligenciarFormData, DiligenciarFormErrors } from '../types/manifestType';

export function validateDiligenciarForm(form: DiligenciarFormData): DiligenciarFormErrors {
    const errors: DiligenciarFormErrors = {};
    if (!form.location || typeof form.location !== 'string' || form.location.trim() === '') {
        errors.location = 'El campo Lugar es obligatorio.';
    }
    if (form.clientId === null || form.clientId === undefined || typeof form.clientId !== 'number') {
        errors.clientId = 'Debe seleccionar un cliente.';
    }
    if (!(form.date instanceof Date)) {
        errors.date = 'La fecha inicial es obligatoria.';
    }
    if (!(form.dateFinal instanceof Date)) {
        errors.dateFinal = 'La fecha final es obligatoria.';
    }
    if (form.plateId === null || form.plateId === undefined || typeof form.plateId !== 'number') {
        errors.plateId = 'Debe seleccionar un vehículo.';
    }
    if (form.manifestTemplateId === null || form.manifestTemplateId === undefined || typeof form.manifestTemplateId !== 'number') {
        errors.manifestTemplateId = 'Debe seleccionar una plantilla.';
    }
    // if (!form.observations || typeof form.observations !== 'string') {
    //     errors.observations = 'El campo Observaciones es obligatorio.';
    // }
    // if (!Array.isArray(form.items) || form.items.length === 0) {
    //     errors.items = 'Debe agregar al menos un ítem.';
    // }
    if (!form.signature || typeof form.signature !== 'string' || form.signature.trim() === '') {
        errors.signature = 'La firma del conductor es obligatoria.';
    }
    if (!form.signatureClient || typeof form.signatureClient !== 'string' || form.signatureClient.trim() === '') {
        errors.signatureClient = 'La firma del cliente es obligatoria.';
    }
    if (!form.contactClient || typeof form.contactClient !== 'string' || form.contactClient.trim() === '') {
        errors.contactClient = 'El nombre del contacto del cliente es obligatorio.';
    }
    if (!form.positionClient || typeof form.positionClient !== 'string' || form.positionClient.trim() === '') {
        errors.positionClient = 'El cargo del contacto del cliente es obligatorio.';
    }
    if (!form.phone || typeof form.phone !== 'string' || form.phone.trim() === '') {
        errors.phone = 'El teléfono del cliente es obligatorio.';
    }
    if (!Array.isArray(form.photos)) {
        errors.photos = 'Debe adjuntar fotos.';
    } else if (form.photos.length > 3) {
        errors.photos = 'Debe adjuntar máximo 3 fotos.';
    }
    if (form.date instanceof Date && form.dateFinal instanceof Date && form.dateFinal < form.date) {
        errors.dateFinal = 'La fecha final no puede ser menor que la inicial.';
    }
    return errors;
}

export function isDuplicateManifest(localManifests: DiligenciarFormData[]) : DiligenciarFormData[] {
    const unique: DiligenciarFormData[] = [];
    const seen = new Set<string>();
    for (const m of localManifests) {

        // Migración: convierte fechas string a Date si es necesario
        const fixed = {
            ...m,
            date: typeof m.date === 'string' ? new Date(m.date) : m.date,
            dateFinal: typeof m.dateFinal === 'string' ? new Date(m.dateFinal) : m.dateFinal,
        };
        
        const result = diligenciarFormSchema.safeParse(fixed);
        if (!result.success) {
            // console.log('Schema fail', fixed, result.error);
            continue;
        }
        const id = (result.data.id || '').toString();
        if (!id) {
            // console.log('ID vacío', fixed);
            continue;
        }
        if (seen.has(id)) continue;
        seen.add(id);
        unique.push(result.data);
    }
    return unique;
}