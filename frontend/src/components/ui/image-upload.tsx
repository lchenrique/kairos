"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { isAxiosError } from "axios"
import { Camera, ImagePlus, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { customInstance } from "@/lib/api/axios-instance"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  onRemove: () => void
  onImageRemoved?: (publicId: string) => void
  disabled?: boolean
}

interface UploadResponse {
  url: string
  publicId: string
}

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Não foi possível enviar a imagem."
  }

  return "Não foi possível enviar a imagem."
}

function getCloudinaryPublicId(value: string) {
  try {
    const imageUrl = new URL(value)
    if (imageUrl.hostname !== "res.cloudinary.com") return null

    const segments = imageUrl.pathname.split("/").filter(Boolean)
    const kairosIndex = segments.indexOf("kairos")
    if (kairosIndex === -1) return null

    return segments
      .slice(kairosIndex)
      .map(decodeURIComponent)
      .join("/")
      .replace(/\.[a-zA-Z0-9]+$/, "")
  } catch {
    return null
  }
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  onImageRemoved,
  disabled,
}: ImageUploadProps) {
  const [isUsingCamera, setIsUsingCamera] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isBusy = disabled || isUploading

  useEffect(() => {
    if (isUsingCamera && !stream) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then(setStream)
        .catch(() => {
          setError("Não foi possível acessar a câmera deste dispositivo.")
          setIsUsingCamera(false)
        })
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isUsingCamera, stream])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {
        setError("Não foi possível iniciar a visualização da câmera.")
      })
    }
  }, [stream])

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    setIsUsingCamera(false)
  }

  const optimizeImage = (canvas: HTMLCanvasElement, quality = 0.82) => {
    const maxDimension = 800
    let width = canvas.width
    let height = canvas.height

    if (width > maxDimension) {
      height = Math.round((height * maxDimension) / width)
      width = maxDimension
    }

    if (height > maxDimension) {
      width = Math.round((width * maxDimension) / height)
      height = maxDimension
    }

    const optimizedCanvas = document.createElement("canvas")
    optimizedCanvas.width = width
    optimizedCanvas.height = height
    const context = optimizedCanvas.getContext("2d")

    if (!context) return canvas.toDataURL("image/jpeg", quality)
    context.drawImage(canvas, 0, 0, width, height)
    return optimizedCanvas.toDataURL("image/jpeg", quality)
  }

  const uploadImage = async (dataUrl: string) => {
    setIsUploading(true)
    setError(null)

    try {
      const blob = await fetch(dataUrl).then((response) => response.blob())
      const formData = new FormData()
      formData.append("file", blob, `member-${Date.now()}.jpg`)

      const uploaded = await customInstance<UploadResponse>({
        url: "/uploads",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })

      onChange(uploaded.url)
    } catch (uploadError) {
      setError(getErrorMessage(uploadError))
    } finally {
      setIsUploading(false)
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d")

    if (!context) {
      setError("Não foi possível processar a foto capturada.")
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    stopCamera()
    await uploadImage(optimizeImage(canvas))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Escolha uma imagem JPG, PNG ou WebP.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("A imagem deve ter no máximo 5 MB.")
      return
    }

    const reader = new FileReader()
    reader.onerror = () => setError("Não foi possível ler a imagem selecionada.")
    reader.onload = () => {
      const image = document.createElement("img")
      image.onerror = () => setError("O arquivo selecionado não é uma imagem válida.")
      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const context = canvas.getContext("2d")
        if (!context) {
          setError("Não foi possível processar a imagem selecionada.")
          return
        }

        context.drawImage(image, 0, 0)
        void uploadImage(optimizeImage(canvas))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = async () => {
    if (!value) return

    const publicId = getCloudinaryPublicId(value)
    setError(null)
    setIsUploading(true)

    try {
      if (publicId) {
        await customInstance<void>({
          url: `/uploads/${encodeURIComponent(publicId)}`,
          method: "DELETE",
        })
        onImageRemoved?.(publicId)
      }
      onRemove()
    } catch (removeError) {
      setError(getErrorMessage(removeError))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-center justify-center">
        <div className="relative h-40 w-40">
          {value ? (
            <>
              <div className="relative h-40 w-40 overflow-hidden rounded-full border bg-muted">
                <Image
                  fill
                  className="rounded-full object-cover"
                  alt="Foto do membro"
                  src={value}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -bottom-2 -right-2"
                onClick={() => void handleRemove()}
                disabled={isBusy}
                aria-label="Remover foto do membro"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-40 w-40 flex-col rounded-full text-muted-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
            >
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <ImagePlus className="h-10 w-10" />
              )}
              <span className="mt-2 text-xs">
                {isUploading ? "Enviando..." : "Adicionar foto"}
              </span>
            </Button>
          )}
        </div>
      </div>

      {!value && (
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Escolher imagem
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setError(null)
              setIsUsingCamera(true)
            }}
            disabled={isBusy}
          >
            <Camera className="mr-2 h-4 w-4" />
            Usar câmera
          </Button>
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
        disabled={isBusy}
      />

      <p className="text-center text-xs text-muted-foreground">
        JPG, PNG ou WebP, com até 5 MB.
      </p>
      {error && (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Dialog
        open={isUsingCamera}
        onOpenChange={(open) => {
          if (!open) stopCamera()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fotografar membro</DialogTitle>
            <DialogDescription>
              Posicione o rosto no centro e confirme quando a imagem estiver nítida.
            </DialogDescription>
          </DialogHeader>
          <video
            ref={videoRef}
            className="aspect-video w-full rounded-lg bg-muted object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={stopCamera}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => void capturePhoto()} disabled={!stream}>
              Tirar foto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
