import z from "zod";
import { clienteSelectSchema } from "../schema/clienteSchema";


export type ClienteSelectType = z.infer<typeof clienteSelectSchema>