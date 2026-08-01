const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export function useCloudinary() {
  const config = useRuntimeConfig()
  const cloudName = config.public.cloudinaryCloudName as string
  const uploadPreset = config.public.cloudinaryUploadPreset as string

  async function hashFile(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  function validarArchivo(file: File): void {
    if (!ALLOWED_MIME.has(file.type)) {
      throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF.')
    }
    if (file.size > MAX_FILE_BYTES) {
      const mb = (MAX_FILE_BYTES / 1024 / 1024).toFixed(0)
      throw new Error(`El archivo supera el tamaño máximo (${mb} MB).`)
    }
  }

  async function uploadFile(file: File): Promise<string> {
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary no configurado (falta cloud_name o upload_preset)')
    }
    validarArchivo(file)
    const hash = await hashFile(file)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('public_id', hash)
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    try {
      const res = await $fetch<{ secure_url: string }>(uploadUrl, {
        method: 'POST',
        body: formData,
      })
      return res.secure_url
    } catch (err: any) {
      const msg = String(err?.data?.error?.message ?? err?.message ?? '').toLowerCase()
      if (msg.includes('already exists') || msg.includes('in use')) {
        return `https://res.cloudinary.com/${cloudName}/image/upload/${hash}`
      }
      throw err
    }
  }

  return { uploadFile, hashFile, validarArchivo }
}
