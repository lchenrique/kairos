"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, ImagePlus, Trash2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  onRemove: () => void
  onImageRemoved?: (publicId: string) => void
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  onImageRemoved,
  disabled
}: ImageUploadProps) {
  const [isUsingCamera, setIsUsingCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isUsingCamera && !stream) {
      navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: "user",
          deviceId: { ideal: "default" }
        } 
      })
      .then((mediaStream) => {
        setStream(mediaStream)
      })
      .catch((error) => {
        console.error("Error accessing camera:", error)
        setIsUsingCamera(false)
      })
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }
  }, [isUsingCamera, stream])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
        .catch(err => console.error("Error playing video:", err))
    }
  }, [stream])

  const startCamera = () => {
    setIsUsingCamera(true)
  }

  const stopCamera = () => {
    setIsUsingCamera(false)
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const optimizeImage = (canvas: HTMLCanvasElement, quality = 0.8): string => {
    const MAX_WIDTH = 800
    const MAX_HEIGHT = 800
    
    let width = canvas.width
    let height = canvas.height

    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width)
      width = MAX_WIDTH
    }

    if (height > MAX_HEIGHT) {
      width = Math.round((width * MAX_HEIGHT) / height)
      height = MAX_HEIGHT
    }

    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = width
    tempCanvas.height = height

    const ctx = tempCanvas.getContext("2d")
    if (!ctx) return canvas.toDataURL("image/jpeg", quality)

    ctx.drawImage(canvas, 0, 0, width, height)
    return tempCanvas.toDataURL("image/jpeg", quality)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const optimizedImage = optimizeImage(canvas)
        onChange(optimizedImage)
        stopCamera()
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (typeof window === "undefined") return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (!reader.result) return

      const img = document.createElement("img")
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const optimizedImage = optimizeImage(canvas)
          onChange(optimizedImage)
        }
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    if (value && value.includes("cloudinary")) {
      const matches = value.match(/kairos\/members\/[^.]+/)
      if (matches) {
        const publicId = matches[0]
        onImageRemoved?.(publicId)
      }
    }
    onRemove()
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-center w-full">
        <div className="relative w-40 h-40">
          {value ? (
            <>
              <div className="relative w-40 h-40 rounded-full overflow-hidden">
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  alt="Avatar"
                  src={value}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -bottom-2 -right-2"
                onClick={handleRemove}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className={cn(
              "w-40 h-40 rounded-full bg-muted flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-75 transition",
              disabled && "opacity-50 cursor-not-allowed hover:opacity-50"
            )}>
              <ImagePlus className="h-10 w-10 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Upload
              </span>
            </div>
          )}
        </div>
      </div>

      {!value && (
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={startCamera}
            disabled={disabled}
          >
            <Camera className="h-4 w-4 mr-2" />
            Câmera
          </Button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
        disabled={disabled}
      />

      {isUsingCamera && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <video
                ref={videoRef}
                className="rounded-lg"
                width="100%"
                height="auto"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-4">
                <Button onClick={capturePhoto} disabled={!stream}>
                  Tirar Foto
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
