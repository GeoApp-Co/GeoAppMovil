import z from "zod";

export const ManifestTemplateSchema = z.object({
    id: z.number(),
    name: z.string(),
})