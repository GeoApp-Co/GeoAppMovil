import z from "zod";

export const itemCategoryEnum = z.enum([
    "RESIDUOS ESPECIALES",
    "RESIDUOS APROVECHABLES",
    "RESIDUOS NO APROVECHABLES",
    "RESIDUOS HOSPITALARIOS",
    "RESIDUOS PELIGROSOS SOLIDOS",
    "RESIDUOS PELIGROSOS LIQUIDOS",
    "RESIDUOS GENERADOS EN ATENCIÓN Y SALUD",
    "SUMINISTRO",
    "SERVICIO",
    "ESPECIAL",
    "INSUMOS",
    "OTRO",
]);

export const unidades = z.enum([
    "litro", 
    "kg", 
    "unidad", 
    'hora', 
    'galones', 
    'm3'
]);

export const ItemSchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    unidad: unidades,
    categoria: itemCategoryEnum
});