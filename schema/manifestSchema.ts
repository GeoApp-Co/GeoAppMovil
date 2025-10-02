
import { z } from "zod";
import { ClienteSchema } from "./clientSchema";
import { UserSchema } from "./userSchema";
import { ManifestTemplateSchema } from "./manifestTemplateSchema";
import { CarSchema } from "./carSchema";
import { ItemSchema } from "./ItemSchema";
import { DisposicionFinalSchema } from "./disposicionFinalSchema";

export const ResponsePaginationSchema = z.object({
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
})

export const ManifestItemSchema = z.object({
    id: z.number(),
    // manifestId: z.number(),
    itemId: z.number(),
    cantidad: z.string(),
    volDesechos: z.string().nullable(),
    nViajes: z.number().nullable(),
    nHoras: z.string().nullable(),
    // createdAt: z.string(),
    // updatedAt: z.string(),
    isInvoiced: z.boolean(),
    // disposicionFinalId: z.number().nullable(),
    tiquete: z.string().nullable(),
    fechaDisposicionFinal: z.string().nullable(),
    certificadoFinal: z.string().nullable(),
    entregado: z.boolean().nullable(),
    item: ItemSchema.pick({
        code: true,
        id: true,
        name: true,
        unidad: true,
        categoria: true
    }),
    // Relación con la combinación de sitio y licencia (disposición final)
    disposicionFinal: DisposicionFinalSchema.pick({
        id: true,
        tratamiento: true,
        sitio: true,
        licencia: true,
    }).nullable().optional(),
});

export const ManifestSchema = z.object({
    id: z.number(),
    location: z.string().nullable(),
    date: z.string(),
    dateFinal: z.string(),
    signature: z.string(),
    signatureClient: z.string(),
    photos: z.array(z.string()),
    observations: z.string().nullable(),
    createdBy: z.number(),
    isInvoiced: z.boolean(),
    quotationCode: z.string().nullable(),
    invoiceCode: z.string().nullable(),
    isEdit: z.boolean(),
    contactClient: z.string(),
    positionClient: z.string(),
    phone: z.string(),
    manifestItems: z.array(ManifestItemSchema.pick({
        id: true,
        cantidad: true,
        item: true,
        nHoras: true,
        nViajes: true,
        volDesechos: true,
    })),
    cliente: ClienteSchema.pick({
        alias: true,
        email: true,
        id: true,
        personaType: true,
        identificacion: true,
        identificacionType: true,
        name: true,
        ubicacion: true,
        direccion: true,
        phone1: true,
        phone2: true
    }),
    user: UserSchema.pick({
        id: true,
        name: true,
        cc: true
    }),
    manifestTemplate: ManifestTemplateSchema,
    car: CarSchema.pick({
        carType: true,
        plate: true
    })
});

export const manifestPreviewSchema = ManifestSchema.pick({
    id: true,
    date: true, 
    isInvoiced: true,
    // isInternallyInvoiced: true,
    // isCertified: true,
    manifestTemplate: true
}).extend({
    cliente: ClienteSchema.pick({
        id: true,
        name: true,
        identificacion: true,
        identificacionType: true,
        alias: true
    })
})

export const paginationManifestSchema = ResponsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    manifests: z.array(manifestPreviewSchema)
})