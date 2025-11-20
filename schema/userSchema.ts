
import { z } from "zod";

export const roles = z.enum([
    "admin", 
    "superAdmin", 
    "conductor", 
    "comercio", 
    "factura", 
    // 'operacion', 
    'disposicionFinal', 
    'nps'
]);

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    cc: z.string().min(1, { message: 'Campo requerido' }),
    password: z.string().min(1, { message:'Campo requerido' }),
    rol: z.object({
        name: roles
    })
});

export const loginSchema = UserSchema.pick({
    cc: true,
    password: true
});

export const userSchema = UserSchema.pick({
    id: true,
    name: true,
    cc: true,
    rol: true   
})