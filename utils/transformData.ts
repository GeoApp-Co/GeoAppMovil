
import { ItemCategoryType, ItemUnitType } from "../types/templateType";
import { RolesType } from "../types/userType";
import { roles } from "../schema/userSchema";

// Diccionario para formatear las unidades
export const unidadLegible: Record<ItemUnitType, string> = {
    litro: "Litros",
    kg: "Kilogramos",
    unidad: "Unidades",
    hora: "Horas",
    galones: "Galones",
    m3: "Metros Cúbicos",
    m2: "Metros Cuadrados",
    servicio: "Servicios",
    gr: "Gramos"
};

export const simboloUnidad : Record<ItemUnitType, string> = {
    litro: "L",
    kg: "kg",
    unidad: "u",
    hora: "h",
    galones: "gal",
    m3: "m³",
    m2: "m²",
    servicio: "srv",
    gr: "gr"
}

export const transformCatgeoria = (categoria: ItemCategoryType | undefined): string  => {
    if (categoria) {
        switch (categoria) {
            case 'ACTIVIDADES REALIZADAS':
                return 'Actividades Realizadas';
            case 'ÁREAS INTERVENIDAS':
                return 'Áreas Intervenidas';
            case 'ESPECIAL':
                return 'Especial';
            case 'FORMA DE APLICACIÓN':
                return 'Forma de Aplicación';
            case 'INSUMOS':
                return 'Insumos';
            case 'LIMPIEZA Y DESINFECCIÓN':
                return 'Limpieza y Desinfección';
            case 'LAVADO, LIMPIEZA Y DESINFECCIÓN DE TANQUES':
                return 'Lavado, Limpieza y Desinfección de Tanques';
            case 'OTRO':
                return 'Otro';
            case 'PLAGAS CONTROLADAS':
                return 'Plagas Controladas';
            case 'PRODUCTO CONTROL DE PLAGAS':
                return 'Producto Control de Plagas';
            case 'PRODUCTO EMPLEADO':
                return 'Producto Empleado';
            case 'RESIDUOS APROVECHABLES':
                return 'Residuos Aprovechables';
            case 'RESIDUOS ESPECIALES':
                return 'Residuos Especiales';
            case 'RESIDUOS GENERADOS EN ATENCIÓN Y SALUD':
                return 'Residuos Generados en Atención y Salud';
            case 'RESIDUOS HOSPITALARIOS':
                return 'Residuos Hospitalarios';
            case 'RESIDUOS NO APROVECHABLES':
                return 'Residuos No Aprovechables';
            case 'RESIDUOS PELIGROSOS LIQUIDOS':
                return 'Residuos Peligrosos Líquidos';
            case 'RESIDUOS PELIGROSOS SOLIDOS':
                return 'Residuos Peligrosos Sólidos';
            case 'SERVICIO':
                return 'Servicio';
            case 'SUMINISTRO':
                return 'Suministro';
            case 'SUMINISTRO DE AGUAS':
                return 'Suministro de Aguas';
            default:
                return `Categoría desconocida (${categoria})`;
        }
    } else {
        return 'Categoría no definida';
    }
}; 

export const parseDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
};

export const traslateRoles = (rolName: string): string => {
    const validRoles: RolesType[] = roles.options;

    const role = validRoles.find(role => role === rolName);

    if (role) {
        switch (role) {
            case 'admin':
                return 'Admin-Operario';
            case 'superAdmin':
                return 'Super Administrador';
            case 'conductor':
                return 'Operario';
            case 'comercio':
                return 'Comercial';
            case 'factura':
                return 'Facturación';
            // case 'operacion':
            //     return 'Operario';
            case 'disposicionFinal':
                return 'Disposición Final';
            case 'nps':
                return 'NPS';
            default:
                return `Rol desconocido (${role})`;
        }
    } else {
        return `Rol desconocido (${rolName})`;
    }
};

/**
 * Formatea la unidad para mostrarla al usuario.
 * @param unidad Valor de la unidad (ItemUnitType)
 * @returns Unidad formateada y legible en mayúsculas
 */
export function formatearUnidad(unidad: ItemUnitType): string {
    return unidadLegible[unidad] || unidad.toUpperCase();
}

/**
 * Formatea una fecha a un string legible para el usuario.
 * Ejemplo: "viernes, 3 de octubre de 2025, 14:30"
 * @param fecha Instancia de Date
 * @returns String legible para mostrar en UI
 */
export function formatearFechaBonita(fecha: Date): string {
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return '';
    return fecha.toLocaleString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}