export default async (file, size) => {
  size ??= 256

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  const ratio = Math.max(size / width, size / height)

  const x = (size - width * ratio) / 2
  const y = (size - height * ratio) / 2

  ctx.drawImage(bitmap, 0, 0, width, height, x, y, width * ratio, height * ratio)

  return canvas.toDataURL('image/jpeg', 0.5).split(';base64,')[1]
}
