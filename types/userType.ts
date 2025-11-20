import { z } from "zod";
import { loginSchema, roles, userSchema } from "../schema/userSchema";

export type RolesType = z.infer<typeof roles>;

export type UserType = z.infer<typeof userSchema>

export type LoginFormType = z.infer<typeof loginSchema>