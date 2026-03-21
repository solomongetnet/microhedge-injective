"use client"

import * as React from "react"
import { Avatar, type AvatarProps } from "./avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarUploadProps extends Omit<AvatarProps, "src" | "loading"> {
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  onUpload?: (file: File) => Promise<string | void>
  maxFileSize?: number // in MB
  acceptedFileTypes?: string[]
  uploadButtonText?: string
  removeButtonText?: string
  showUploadButton?: boolean
  showRemoveButton?: boolean
  disabled?: boolean
  imageLoading?: "eager" | "lazy"
  uploading?: boolean
}

const AvatarUpload = React.forwardRef<HTMLDivElement, AvatarUploadProps>(
  (
    {
      name = "",
      fallback,
      size = "xl",
      variant = "default",
      onFileSelect,
      onFileRemove,
      onUpload,
      maxFileSize = 5, // 5MB default
      acceptedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      uploadButtonText = "Upload Avatar",
      removeButtonText = "Remove",
      showUploadButton = true,
      showRemoveButton = true,
      disabled = false,
      imageLoading = "lazy",
      uploading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Cleanup preview URL when component unmounts or file changes
    React.useEffect(() => {
      return () => {
        if (previewUrl && typeof previewUrl === "string") {
          try {
            URL.revokeObjectURL(previewUrl)
          } catch (error) {
            console.warn("Failed to revoke object URL:", error)
          }
        }
      }
    }, [previewUrl])

    const validateFile = (file: File): string | null => {
      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        return `File type not supported. Please select: ${acceptedFileTypes.join(", ")}`
      }

      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > maxFileSize) {
        return `File size too large. Maximum size is ${maxFileSize}MB`
      }

      return null
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setSelectedFile(file)

      // Create preview URL with proper type checking
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      // Ensure file is a valid Blob/File before creating object URL
      //@ts-ignore
      if (file instanceof File || file instanceof Blob) {
        const newPreviewUrl = URL.createObjectURL(file)
        setPreviewUrl(newPreviewUrl)
      } else {
        setError("Invalid file type selected")
        return
      }

      // Call callback
      onFileSelect?.(file)
    }

    const handleRemoveFile = () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setSelectedFile(null)
      setPreviewUrl(null)
      setError(null)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      onFileRemove?.()
    }

    const handleUpload = async () => {
      if (!selectedFile || !onUpload) return

      // Additional validation before upload
      if (!(selectedFile instanceof File)) {
        setError("Invalid file selected")
        return
      }

      try {
        setIsUploading(true)
        setError(null)
        await onUpload(selectedFile)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setIsUploading(false)
      }
    }

    const handleAvatarClick = () => {
      if (!disabled && !uploading && !isUploading) {
        fileInputRef.current?.click()
      }
    }

    const isLoading = uploading || isUploading

    return (
      <div ref={ref} className={cn("flex flex-col items-center gap-4", className)}>
        {/* Avatar with click to upload */}
        <div className="relative group">
          <Avatar
            src={previewUrl || undefined}
            name={name}
            fallback={fallback}
            size={size}
            variant={variant}
            loading={imageLoading}
            interactive={!disabled && !isLoading}
            onClick={handleAvatarClick}
            className={cn(
              "transition-all duration-200",
              !disabled && !isLoading && "cursor-pointer hover:opacity-80",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            {...props}
          />

          {/* Upload overlay */}
          {!disabled && !isLoading && (
            <div
              className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Camera className="h-6 w-6 text-white" />
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isLoading}
        />

        {/* Action buttons */}
        <div className="flex gap-2">
          {showUploadButton && (
            <Button
              onClick={selectedFile && onUpload ? handleUpload : handleAvatarClick}
              disabled={disabled || isLoading}
              size="sm"
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {selectedFile && onUpload ? "Upload" : uploadButtonText}
                </>
              )}
            </Button>
          )}

          {showRemoveButton && (selectedFile || previewUrl) && (
            <Button
              onClick={handleRemoveFile}
              disabled={disabled || isLoading}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <X className="h-4 w-4" />
              {removeButtonText}
            </Button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <Card className="w-full max-w-sm">
            <CardContent className="p-3">
              <p className="text-sm text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* File info */}
        {selectedFile && !error && (
          <Card className="w-full max-w-sm">
            <CardContent className="p-3">
              <div className="text-sm text-muted-foreground text-center">
                <p className="font-medium">{selectedFile.name}</p>
                <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  },
)

AvatarUpload.displayName = "AvatarUpload"

export { AvatarUpload, type AvatarUploadProps }
