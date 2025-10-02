import z from "zod";
import { CarSchema } from "../schema/carSchema";

export type CarType = z.infer<typeof CarSchema>