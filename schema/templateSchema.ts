import z from "zod";
import { ItemSchema } from "./ItemSchema";

export const TemplateSchema = z.object({
    id: z.number(),
    name: z.string(),
    items: z.array(ItemSchema.pick({
        code: true,
        id: true,
        name: true,
        unidad: true,
        categoria: true
    }))
})

export const TemplatesSchema =  z.object({
    templates: z.array(TemplateSchema)
})

export const ItemTemplateSchema = ItemSchema.pick({
    code: true,
    id: true,
    name: true,
    unidad: true,
    categoria: true
})