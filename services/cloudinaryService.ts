
const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

// Deducción automática de nombre y tipo a partir de la uri
function getFileNameAndType(uri: string) {
    const parts = uri.split('/');
    const fileName = parts[parts.length - 1] || `photo_${Date.now()}.jpg`;
    const ext = fileName.split('.').pop()?.toLowerCase();
    let type = 'image/jpeg';
    if (ext === 'png') type = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') type = 'image/jpeg';
    return { name: fileName, type };
}

/**
 * Sube imágenes a Cloudinary usando solo un array de uris locales (string[])
 * Deducción automática de name y type para compatibilidad con React Native y Cloudinary
 * @param uris string[]
 * @returns Promise<string[]> urls subidas
 */
export async function uploadImagesToCloudinary(uris: string[]) {
    if (!CLOUDINARY_URL || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration missing (CLOUDINARY_URL or CLOUDINARY_UPLOAD_PRESET)');
    }

    const uploaded: string[] = [];

    for (const uri of uris) {
        try {
            const { name, type } = getFileNameAndType(uri);
            const form = new FormData();
            form.append('file', {
                uri,
                name,
                type,
            } as any);
            form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const res = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: form as any,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
            }

            const json = await res.json();
            if (!json || !json.secure_url) {
                throw new Error('Invalid Cloudinary response');
            }

            uploaded.push(json.secure_url);
        } catch (err) {
            throw err;
        }
    }

    return uploaded;
}

export default uploadImagesToCloudinary;
