import z from "zod";

export const carTypeEnum = z.enum([
    "CAMIONETA", 
    "COMPACTADOR", 
    "FURGON", 
    "VOLQUETA"
]);

export const CarSchema = z.object({
    id: z.number(),
    carType: carTypeEnum,
    plate: z.string()
})

export const responseCarsSchema = z.object({
    cars: z.array(CarSchema)
})