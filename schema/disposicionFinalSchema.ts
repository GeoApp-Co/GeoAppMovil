import z from "zod";

export const tratamientosDisposicionFinalEnum = z.enum([
    "TRATAMIENTO/DISPOSICIÓN FINAL",
    "CONFINAMIENTO EN RELLENO SANITARIO",
    "CONFINAMIENTO EN CELDA DE SEGURIDAD",
    "BIORREMEDIACIÓN CON LANDFARMING",
    "APROVECHAMIENTO DE ACEITES USADOS",
    "VENTA DE AGUA EN BLOQUE",
    "APROVECHAMIENTO DE ACEITES DE COCINA USADOS",
    "DEWATERING - BIORREMEDIACIÓN",
    "APROVECHAMIENTO",
    "DESACTIVACIÓN",
    "DISPOSICIÓN FINAL",
    "INCINERACIÓN"
]);

export const DisposicionFinalSitioSchema = z.object({
    id: z.number(),
    nombre: z.string(),
});

export const DisposicionFinalLicenciaSchema = z.object({
    id: z.number(),
    licencia: z.string(),
});

export const DisposicionFinalSchema = z.object({
    id: z.number(),
    sitio: DisposicionFinalSitioSchema,
    licencia: DisposicionFinalLicenciaSchema,
    sitioId: z.number(),
    licenciaId: z.number(),
    tratamiento: tratamientosDisposicionFinalEnum
});