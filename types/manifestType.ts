import z from "zod";
import { diligenciarFormSchema, itemCantidadFormSchema, manifestPreviewSchema } from "../schema/manifestSchema";

export type ManifestPreviewType = z.infer<typeof manifestPreviewSchema>

export type ItemCantidad = z.infer<typeof itemCantidadFormSchema>;

export type DiligenciarFormData = z.infer<typeof diligenciarFormSchema>;

export type DiligenciarFormErrors = Partial<Record<keyof DiligenciarFormData, string>>;

// export type NewManifestFormTypePrueba = {
//     photos: string[];
//     contactClient: string;
//     positionClient: string;
//     phone: string
// }

export type NewManifestFormType = {
    clientId: number;
    manifestTemplateId: number;
    plateId: number | string;
    date: Date;
    dateFinal: Date;
    observations: string;
    items: ItemCantidad[];
    photos: string[];
    signature: string;
    signatureClient: string;
    location: string;
    contactClient: string;
    positionClient: string;
    phone: string;
}