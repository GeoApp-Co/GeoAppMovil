import z from "zod";
import { manifestPreviewSchema } from "../schema/manifestSchema";

export type ManifestPreviewType = z.infer<typeof manifestPreviewSchema>