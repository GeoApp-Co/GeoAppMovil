
import { string, z } from "zod";
import { userSchema, UserSchema } from "./userSchema";
import { ManifestTemplateSchema } from "./manifestTemplateSchema";
import { CarSchema } from "./carSchema";
import { ItemSchema } from "./ItemSchema";
import { DisposicionFinalSchema } from "./disposicionFinalSchema";
import { ClienteSchema } from "./clienteSchema";

export const ResponsePaginationSchema = z.object({
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
})


export const itemCantidadFormSchema = z.object({
    itemId: z.number(),
    cantidad: z.number(),
    volDesechos: z.number().optional(),
    nViajes: z.number().optional(),
    nHoras: z.number().optional(),
    dosis: z.number().optional(),
    ubicacion: z.string().optional(),
    lote: z.string().optional(),
    dateVencimiento: z.string().optional(),
});

export const diligenciarFormSchema = z.object({
    id: z.string(),
    location: z.string(),
    clientId: z.number().nullable(),
    date: z.date(),
    dateFinal: z.date(),
    plateId: z.number().nullable(),
    manifestTemplateId: z.number().nullable(),
    observations: z.string(),
    items: z.array(itemCantidadFormSchema.pick({
        itemId: true,
        cantidad: true,
        volDesechos: true,
        nViajes: true,
        nHoras: true,
        dosis: true,
        ubicacion: true,
        lote: true,
        dateVencimiento: true,
    })),
    signature: z.string(),
    signatureClient: z.string(),
    contactClient: z.string(),
    positionClient: z.string(),
    phone: z.string(),
    photos: z.array(z.string()),
});

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

    dosis: z.string().optional().nullable(),
    ubicacion: z.string().optional().nullable(),
    lote: z.string().optional().nullable(),
    dateVencimiento: z.string().optional().nullable(),

    item: ItemSchema.pick({
        code: true,
        id: true,
        name: true,
        unidad: true,
        categoria: true,
        nHoras: true,
        nViajes: true,
        volDesechos: true,
        dateVencimiento: true,
        lote: true,
        dosis: true,
        ubicacion: true

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
        dosis: true,
        ubicacion: true,
        dateVencimiento: true,
        lote: true,
    })).optional(),
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
        id: true,
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

export const manifestSchema = ManifestSchema.pick({
    id:true,
    location: true,
    date: true,
    dateFinal: true,
    signature: true,
    signatureClient: true,
    photos: true,
    observations: true,
    createdBy: true,
    isInvoiced: true,
    // isInternallyInvoiced: true,
    // isCertified: true,
    contactClient: true,
    positionClient: true,
    manifestItems: true,
    cliente: true,
    // user: true,
    manifestTemplate: true,
    car: true,
    phone: true
}).extend({
    user: userSchema.pick({
        id: true,
        name: true,
        cc: true,
        rol: true
    })
})