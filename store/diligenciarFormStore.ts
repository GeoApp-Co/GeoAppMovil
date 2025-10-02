import { create } from 'zustand';
import { CarType } from '../types/CarType';
import { getItem, getParsedItem, saveItem } from '../utils/storage';
import { CarSchema, responseCarsSchema } from '../schema/carSchema';
import { TemplateType } from '../types/templateType';
import { TemplateSchema } from '../schema/templateSchema';


export interface DiligenciarFormData {
    location: string;
    date: Date;
    dateFinal: Date;
    carId: number | null;
    templateId: number | null;
    observations: string;
}

export interface DiligenciarFormState {
    form: DiligenciarFormData;
    cars: CarType[];
    templates: TemplateType[];
    setForm: (form: Partial<DiligenciarFormData>) => void;
    setCars: (cars: CarType[]) => void;
    saveLocalCars: () => Promise<void>;
    refreshCars: () => Promise<void>;
    setTemplates: (templates: TemplateType[]) => void;
    saveLocalTemplates: () => Promise<void>;
    refreshTemplates: () => Promise<void>;
    resetForm: () => void;
}

const initialForm: DiligenciarFormData = {
    location: '',
    date: new Date(),
    dateFinal: new Date(Date.now() + 60 * 60 * 1000),
    carId: null,
    templateId: null,
    observations: '',
};

export const useDiligenciarFormStore = create<DiligenciarFormState>((set) => ({
    form: { ...initialForm },
    cars: [],
    templates: [],
    setForm: (form) => set((state) => ({ form: { ...state.form, ...form } })),
    setCars: async (cars) => {set({ cars })},
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
    setTemplates: (templates) => set({ templates }),
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
    resetForm: () => set({ form: { ...initialForm } }),
}));
