import { useDiligenciarFormStore } from "../store/diligenciarFormStore";


export function useDiligenciarForm() {
    const {
        manifestLocales,
        form,
        resetForm,
        setForm,
        cars,
        clientes,
        templates,
        addManifestLocal,
        errores,
        setCars,
        setTemplates,
        setClientes,
        refreshCars,
        refreshTemplates,
        refreshClientes,
        saveLocalTemplates,
        saveLocalCars,
        saveLocalClientes,
        setFormItems,
        items,
        refreshManifestLocales,
        saveLocalManifestLocales,
        clearAllStorage,
        removeManifestLocal,
        validateField,
        clearFieldError
    } = useDiligenciarFormStore();

    return {
        form,
        cars,
        templates,
        resetForm,
        setForm,
        setCars,
        setTemplates,
        refreshCars,
        refreshTemplates,
        saveLocalTemplates,
        saveLocalCars,
        clientes, 
        setClientes,
        refreshClientes,
        saveLocalClientes,
        setFormItems,
        addManifestLocal,
        errores,
        manifestLocales,
        items,
        refreshManifestLocales,
        saveLocalManifestLocales,
        removeManifestLocal,
        clearAllStorage,
        validateField,
        clearFieldError
    };
}
