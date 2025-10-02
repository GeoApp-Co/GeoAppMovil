import { z } from "zod";
import { loginSchema, userSchema } from "../schema/userSchema";

export type UserType = z.infer<typeof userSchema>

export type LoginFormType = z.infer<typeof loginSchema>