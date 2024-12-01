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
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
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

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="Member photo"
              fill
              className="object-cover rounded-full"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2"
              onClick={handleRemove}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            <Button type="button" onClick={startCamera} disabled={disabled}>
              <Camera className="h-4 w-4 mr-2" />
              Nova Foto
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={disabled}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Trocar Foto
            </Button>
          </div>
        </div>
      ) : isUsingCamera ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40 bg-muted rounded-full overflow-hidden border-2 border-border">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ background: "black" }}
            />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex justify-center gap-2">
            <Button type="button" onClick={capturePhoto} disabled={disabled}>
              <Camera className="h-4 w-4 mr-2" />
              Tirar Foto
            </Button>
            <Button type="button" onClick={stopCamera} variant="outline" disabled={disabled}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40 bg-muted rounded-full overflow-hidden border-2 border-border flex items-center justify-center">
            <ImagePlus className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="flex justify-center gap-4">
            <Button type="button" onClick={startCamera} disabled={disabled}>
              <Camera className="h-4 w-4 mr-2" />
              Usar Câmera
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={disabled}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
