export default async (file, wdth, hght) => {
  wdth ??= 256
  hght ??= 256

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = wdth
  canvas.height = hght

  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  const ratio = Math.max(wdth / width, hght / height)

  const x = (wdth - width * ratio) / 2
  const y = (hght - height * ratio) / 2

  ctx.drawImage(bitmap, 0, 0, width, height, x, y, width * ratio, height * ratio)

  return canvas.toDataURL('image/jpeg', 0.5)
}
