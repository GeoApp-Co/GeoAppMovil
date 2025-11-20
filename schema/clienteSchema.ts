import z from "zod";
import { ResponsePaginationSchema } from "./manifestSchema";

export const identificacionTypeEnum = z.enum([
    "cc",              // Cédula de ciudadanía
    "ti",              // Tarjeta de identidad
    "ce",              // Cédula de extranjería
    "nit",             // Número de identificación tributaria
    "rc",              // Registro civil
    "pa",              // Pasaporte
    "pep",             // Permiso especial de permanencia
    "diplomatico",     // Carné diplomático
    "sinIdentificacion"// Documento extranjero sin identificación local
]);

export const personaTypeEnum = z.enum(["natural", "juridica"]);

export const ClienteSchema = z.object({
    id: z.number(),
    name: z.string(),
    alias: z.string(),
    personaType: personaTypeEnum,
    identificacionType: identificacionTypeEnum,
    identificacion: z.string(),
    email: z.string(),
    direccion: z.string(),
    phone1: z.string(),
    phone2: z.string(),
    ubicacion: z.string(),
    contacto: z.string().nullable().optional(),
    // createdAt: z.string(),
    // updatedAt: z.string()
});

export const clienteSelectSchema = ClienteSchema.pick({
    id: true,
    identificacion: true,
    name: true,
    alias: true,
    identificacionType: true,
})

export const paginationClientesSchema = z.object({
    clientes: z.array(clienteSelectSchema)
})