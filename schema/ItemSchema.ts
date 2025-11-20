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
    "OTRO",
    "INSUMOS",

    // CERTIFICADO DE SUMINISTRO DE AGUAS
    "SUMINISTRO DE AGUAS",

    // CERTIFICADO DE LIMPIEZA Y DESINFECCIÓN
    "LIMPIEZA Y DESINFECCIÓN",

    // CERTIFICADO DE PROCESO DE LAVADO, LIMPIEZA Y DESINFECCIÓN
    "LAVADO, LIMPIEZA Y DESINFECCIÓN DE TANQUES",
    "TIPO DE LAVADO",

    // CERTIFICADO DE CONTROL DE PLAGAS,
    "PLAGAS CONTROLADAS",
    "FORMA DE APLICACIÓN",
    "PRODUCTO CONTROL DE PLAGAS",
    "ACTIVIDADES REALIZADAS", 

    // CERTIFICADO - ÁREAS INTERVENIDAS
    "ÁREAS INTERVENIDAS",
    "PRODUCTO EMPLEADO",
    "CATEGORIA ESPECIAL"
]);

export const unidades = z.enum([
    "litro", 
    "kg", 
    "unidad", 
    'hora', 
    'galones', 
    'm3',
    "m2",
    "servicio",
    "gr"
]);

export const ItemSchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    unidad: unidades,
    nHoras: z.number().nullable().optional(),
    nViajes: z.number().nullable().optional(),
    volDesechos: z.number().nullable().optional(),
    categoria: itemCategoryEnum,
    dosis: z.number().nullable().optional(),
    ubicacion: z.string().nullable().optional(),
    dateVencimiento: z.string().nullable().optional(),
    lote: z.string().nullable().optional()  
});