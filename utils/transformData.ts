import { z } from "zod";
import { ItemUnitType } from "../types/templateType";

// Diccionario para formatear las unidades
const unidadLegible: Record<ItemUnitType, string> = {
    litro: "LITROS",
    kg: "KILOGRAMOS",
    unidad: "UNIDADES",
    hora: "HORAS",
    galones: "GALONES",
    m3: "METROS CÚBICOS"
};

/**
 * Formatea la unidad para mostrarla al usuario.
 * @param unidad Valor de la unidad (ItemUnitType)
 * @returns Unidad formateada y legible en mayúsculas
 */
export function formatearUnidad(unidad: ItemUnitType): string {
    return unidadLegible[unidad] || unidad.toUpperCase();
}