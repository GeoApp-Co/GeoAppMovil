import { create } from 'zustand';
import { CarType } from '../types/CarType';
import { getItem, getParsedItem, saveItem } from '../utils/storage';
import { CarSchema, responseCarsSchema } from '../schema/carSchema';
import { ItemTemplateType, TemplateType } from '../types/templateType';
import { TemplateSchema } from '../schema/templateSchema';
import { ClienteSelectType } from '../types/clienteType';
import { clienteSelectSchema } from '../schema/clienteSchema';

import { DiligenciarFormData, DiligenciarFormErrors, ItemCantidad } from '../types/manifestType';
import { validateDiligenciarForm, generateUniqueId, isDuplicateManifest } from '../utils/validateDiligenciarForm';
import { diligenciarFormSchema } from '../schema/manifestSchema';

// export interface DiligenciarFormData {
//     location: string;
//     clientId: number | null;
//     date: Date;
//     dateFinal: Date;
//     carId: number | null;
//     templateId: number | null;
//     observations: string;
// }

export interface DiligenciarFormState {
    manifestLocales: DiligenciarFormData[];
    form: DiligenciarFormData;
    cars: CarType[];
    templates: TemplateType[];
    clientes: ClienteSelectType[];
    items: any[];
    errores: DiligenciarFormErrors;
    validateField: (fieldName: string, value: any) => void;
    clearFieldError: (fieldName: string) => void;
    addManifestLocal: (manifest: DiligenciarFormData) => void;
    setForm: (form: Partial<DiligenciarFormData>) => void;
    setFormItems: (items: ItemTemplateType[]) => void;
    setCars: (cars: CarType[]) => void;
    setTemplates: (templates: TemplateType[]) => void;
    setClientes: (clientes: ClienteSelectType[]) => void;
    saveLocalCars: () => Promise<void>;
    saveLocalTemplates: () => Promise<void>;
    saveLocalClientes: () => Promise<void>;
    refreshCars: () => Promise<void>;
    refreshTemplates: () => Promise<void>;
    refreshClientes: () => Promise<void>;
    saveLocalManifestLocales: () => Promise<void>;
    refreshManifestLocales: () => Promise<void>;
    removeManifestLocal: (id: string) => Promise<void>;
    resetForm: () => void;
    clearAllStorage: () => Promise<void>;
}

const initialForm: DiligenciarFormData = {
    id: '',
    location: '',
    clientId: null,
    date: new Date(),
    dateFinal: new Date(Date.now() + 60 * 60 * 1000),
    plateId: null,
    manifestTemplateId: null,
    observations: '',
    items: [],
    signature: '',
    signatureClient: '',
    contactClient: '',
    positionClient: '',
    phone: '',
    photos: []
};

export const useDiligenciarFormStore = create<DiligenciarFormState>((set) => ({
    manifestLocales: [],
    form: { ...initialForm },
    cars: [],
    templates: [],
    clientes: [],
    items: [],
    errores: {},
    validateField: (fieldName: string, value: any) => set((state) => {
        // Crear un formulario temporal con el nuevo valor
        const tempForm = { ...state.form, [fieldName]: value };
        const allErrors = validateDiligenciarForm(tempForm);
        
        // Crear objeto de errores actualizado
        const newErrors = { ...state.errores };
        
        // Si hay error para este campo, agregarlo; si no, eliminarlo
        if (allErrors[fieldName as keyof DiligenciarFormErrors]) {
            newErrors[fieldName as keyof DiligenciarFormErrors] = allErrors[fieldName as keyof DiligenciarFormErrors];
        } else {
            delete newErrors[fieldName as keyof DiligenciarFormErrors];
        }
        
        return { errores: newErrors };
    }),
    clearFieldError: (fieldName: string) => set((state) => {
        const newErrors = { ...state.errores };
        delete newErrors[fieldName as keyof DiligenciarFormErrors];
        return { errores: newErrors };
    }),
    addManifestLocal: (manifest) => set((state) => {
        const errores = validateDiligenciarForm(manifest);
        if (Object.keys(errores).length > 0) {
            return { errores };
        }

        // Asignar un id único si no existe
        const manifestWithId = {
            ...manifest,
            id: manifest.id || generateUniqueId(),
        };

        return {
            manifestLocales: [...state.manifestLocales, manifestWithId],
            errores: {},
            form: { ...initialForm }
        };
    }),
    setForm: (form) => set((state) => {
        const newForm = { ...state.form, ...form };
        
        // Validar solo los campos que han cambiado
        const changedFields = Object.keys(form);
        const allErrors = validateDiligenciarForm(newForm);
        const newErrors = { ...state.errores };
        
        // Actualizar errores solo para los campos modificados
        changedFields.forEach(fieldName => {
            if (allErrors[fieldName as keyof DiligenciarFormErrors]) {
                newErrors[fieldName as keyof DiligenciarFormErrors] = allErrors[fieldName as keyof DiligenciarFormErrors];
            } else {
                delete newErrors[fieldName as keyof DiligenciarFormErrors];
            }
        });
        
        return { form: newForm, errores: newErrors };
    }),
    setFormItems: (items) => {

        const itemsForm : ItemCantidad[] = items.map(i => ({
            itemId: i.id,
            cantidad: 0,
            volDesechos: 0,
            nViajes: 0,
            nHoras: 0,
            dosis: 0,
            ubicacion: '',
            lote: '',
            dateVencimiento: ''
        }))

        set((state) => ({ 
            form: { ...state.form, items: itemsForm } 
        }))
    },
    setCars: async (cars) => {set({ cars })},
    setTemplates: (templates) => set({ templates }),
    setClientes: async (clientes) => {set({ clientes })},
    saveLocalCars: async () => {
        set((state) => {
            // Parsear cada carro con CarSchema
            const parsedCars = state.cars.map((m) => {
                const result = CarSchema.safeParse(m);
                return result.success ? result.data : null;
            }).filter(Boolean);

            // Guardar solo el array, no un objeto
            saveItem('CARS', JSON.stringify(parsedCars));
            return {};
        });
    },
    saveLocalTemplates: async () => {
        set((state) => {
            // Parsear cada plantilla con TemplateSchema
            const parsedTemplates = state.templates.map((m) => {
                const result = TemplateSchema.safeParse(m);
                return result.success ? result.data : null;
            }).filter(Boolean);

            // Guardar solo el array, no un objeto
            saveItem('TEMPLATES', JSON.stringify(parsedTemplates));
            return {};
        });
    },
    saveLocalClientes: async () => {
        set((state) => {
            // Parsear cada cliente con ClienteSchema
            const parsedClientes = state.clientes.map((m) => {
                const result = clienteSelectSchema.safeParse(m);
                return result.success ? result.data : null;
            }).filter(Boolean);

            // Guardar solo el array, no un objeto
            saveItem('CLIENTES', JSON.stringify(parsedClientes));
            return {};
        });
    },
    saveLocalManifestLocales: async () => {
        // Lee los manifiestos actuales del storage ("nube")
        const localManifestsStr = await getItem('MANIFEST_LOCALES');
        let manifests: DiligenciarFormData[] = [];
        if (localManifestsStr) {
            try {
                const parsed = JSON.parse(localManifestsStr);
                if (Array.isArray(parsed)) {
                    manifests = parsed;
                }
            } catch (e) {
                // Si hay error de parseo, deja manifests como []
            }
        }

        // Obtiene los del estado actual del store
        const storeManifests = useDiligenciarFormStore.getState().manifestLocales || [];
        let allManifests = [...manifests, ...storeManifests];

        
        // Validar y filtrar duplicados por id único
        const unique: DiligenciarFormData[] = isDuplicateManifest(allManifests)
        saveItem('MANIFEST_LOCALES', JSON.stringify(unique));
    },
    removeManifestLocal: async (id: string) => {
        // Eliminar del estado y persistir
        set((state) => {
            const updated = (state.manifestLocales || []).filter(m => m.id !== id);
            try {
                saveItem('MANIFEST_LOCALES', JSON.stringify(updated));
            } catch (e) {
                // ignore
            }
            return { manifestLocales: updated } 
        });
    },
    refreshCars: async () => {
        const localCarsStr = await getItem('CARS');
        let cars: CarType[] = [];
        
        if (localCarsStr) {
            try {
                const parsed = JSON.parse(localCarsStr);
                if (Array.isArray(parsed)) {
                    cars = parsed;
                }
            } catch (e) {
                // Si hay error de parseo, deja cars como []
            }
        }
        set({ cars });
    },
    refreshTemplates: async () => {
        const localTemplatesStr = await getItem('TEMPLATES');
        let templates: TemplateType[] = [];
        
        if (localTemplatesStr) {
            try {
                const parsed = JSON.parse(localTemplatesStr);
                if (Array.isArray(parsed)) {
                    templates = parsed;
                }
            } catch (e) {
                // Si hay error de parseo, deja templates como []
            }
        }
        set({ templates });
    },
    refreshClientes: async () => {
        const localClientesStr = await getItem('CLIENTES');
        let clientes: ClienteSelectType[] = [];

        if (localClientesStr) {
            try {
                const parsed = JSON.parse(localClientesStr);
                if (Array.isArray(parsed)) {
                    clientes = parsed;
                }
            } catch (e) {
                // Si hay error de parseo, deja clientes como []
            }
        }
        set({ clientes });
    },
    refreshManifestLocales: async () => {
        const localManifestsStr = await getItem('MANIFEST_LOCALES');
        let manifests: DiligenciarFormData[] = [];
        if (localManifestsStr) {
            try {
                const parsed = JSON.parse(localManifestsStr);
                if (Array.isArray(parsed)) {
                    manifests = parsed;
                }
            } catch (e) {
                // Si hay error de parseo, deja manifests como []
            }
        }

        const manifestLocales: DiligenciarFormData[] = isDuplicateManifest(manifests);

        set({ manifestLocales });
    },
    resetForm: () => set({ form: { ...initialForm }, errores: {} }),
    
    // Función para limpiar todo el almacenamiento (solo para desarrollo)
    clearAllStorage: async () => {
        try {
            await saveItem('CARS', '[]');
            await saveItem('TEMPLATES', '[]');
            await saveItem('CLIENTES', '[]');
            await saveItem('MANIFEST_LOCALES', '[]');
            
            set({
                manifestLocales: [],
                form: { ...initialForm },
                cars: [],
                templates: [],
                clientes: [],
                items: [],
                errores: {}
            });
            
            console.log('✅ Todo el almacenamiento ha sido limpiado');
        } catch (error) {
            console.error('❌ Error al limpiar el almacenamiento:', error);
        }
    },
}));
