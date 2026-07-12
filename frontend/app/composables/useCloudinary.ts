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

  async function uploadFile(file: File): Promise<string> {
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary no configurado (falta cloud_name o upload_preset)')
    }
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

  return { uploadFile, hashFile }
}
