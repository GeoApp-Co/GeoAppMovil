import z from "zod";
import { ItemTemplateSchema, TemplateSchema } from "../schema/templateSchema";
import { itemCategoryEnum, unidades } from "../schema/ItemSchema";

export type TemplateType = z.infer<typeof TemplateSchema>

export type ItemTemplateType = z.infer<typeof ItemTemplateSchema>

export type ItemCategoryType = z.infer<typeof itemCategoryEnum>

export type ItemUnitType = z.infer<typeof unidades>