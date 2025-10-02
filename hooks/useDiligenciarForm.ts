import { useDiligenciarFormStore } from "../store/diligenciarFormStore";


export function useDiligenciarForm() {
    const {
        form,
        resetForm,
        setForm,
        cars,
        templates,
        setCars,
        setTemplates,
        refreshCars,
        refreshTemplates,
        saveLocalTemplates,
        saveLocalCars,
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
        saveLocalCars
    };
}
