import { z } from "zod";

export const personaType = z.enum([
    "natural", 
    "juridica"
]);

export const identificacionType = z.enum([
    "cc",              
    "ti",              
    "ce",             
    "nit",             
    "rc",              
    "pa",              
    "pep",             
    "diplomatico",     
    "sinIdentificacion"
]);

export const ClienteSchema = z.object({
    id: z.number(),
    name: z.string(),
    alias: z.string(),
    personaType: personaType,
    identificacionType: identificacionType,
    identificacion: z.string(),
    email: z.string(),
    direccion: z.string(),
    phone1: z.string(),
    phone2: z.string(),
    ubicacion: z.string(),
    contacto: z.string().nullable().optional(),
});
