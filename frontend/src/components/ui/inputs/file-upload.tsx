'use client'

import {
  File,
  FileSpreadsheet,
  FileImage,
  FileText,
  FileAudio,
  FileVideo,
  FileArchive,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  type ChangeEvent,
  type DragEvent,
  useRef,
  useState,
  useEffect,
} from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/actions/button'
import { Card } from '@/components/ui/layout/card'
import { Progress } from '@/components/ui/feedback/progress'

import { useTranslation } from 'react-i18next'

// Default file types for spreadsheets
const DEFAULT_SPREADSHEET_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const DEFAULT_SPREADSHEET_EXTENSIONS = ['.csv', '.xlsx', '.xls']

export interface FileUploadProps {
  // File validation
  acceptedFileTypes?: string[] // MIME types
  acceptedExtensions?: string[] // File extensions with dot (e.g., ['.csv', '.pdf'])
  maxFileSize?: number // In bytes

  // Initial state
  initialFile?: File | null

  // Callbacks
  onFileSelect?: (file: File) => void
  onFileUpload?: (file: File) => Promise<void> | void
  onFileRemove?: () => void
  onValidationError?: (error: string) => void

  // UI customization
  title?: string
  description?: string
  dragDropText?: string
  dropText?: string
  chooseFileText?: string
  uploadButtonText?: string
  cancelButtonText?: string
  showDummyFile?: boolean
  showActionButtons?: boolean
  toUploadText?: string

  // Icons
  icon?: LucideIcon
  fileIcon?: LucideIcon

  // Progress control (external)
  externalProgress?: number
  isUploading?: boolean

  // Styling
  className?: string
  compact?: boolean
}

export default function FileUpload({
  acceptedFileTypes = DEFAULT_SPREADSHEET_TYPES,
  acceptedExtensions = DEFAULT_SPREADSHEET_EXTENSIONS,
  maxFileSize = 20 * 1024 * 1024, // 100MB default
  initialFile = null,
  onFileSelect,
  onFileUpload,
  onFileRemove,
  onValidationError,
  title = 'File Upload',
  description,
  dragDropText = 'Drag and drop or',
  dropText = 'Drop file here',
  chooseFileText = 'choose file',
  uploadButtonText = 'Upload',
  cancelButtonText = 'Cancel',
  toUploadText = 'to upload',
  showDummyFile = false,
  showActionButtons = true,
  icon: Icon = File,
  fileIcon: CustomFileIcon,
  externalProgress,
  isUploading: externalIsUploading,
  className = '',
  compact = false,
}: FileUploadProps) {
  const [uploadState, setUploadState] = useState<{
    file: File | null
    progress: number
    uploading: boolean
  }>({
    file: initialFile,
    progress: initialFile ? 100 : 0,
    uploading: false,
  })
  const [showDummy, setShowDummy] = useState(showDummyFile)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { t } = useTranslation()

  // Sync with initialFile prop
  useEffect(() => {
    if (initialFile) {
      setUploadState({
        file: initialFile,
        progress: 100,
        uploading: false,
      })
    } else {
      // Clear the file when initialFile becomes null
      setUploadState({
        file: null,
        progress: 0,
        uploading: false,
      })
      // Also clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [initialFile])

  // Use external progress if provided, otherwise use internal
  const progress = externalProgress ?? uploadState.progress
  const uploading = externalIsUploading ?? uploadState.uploading

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type (support wildcards like 'image/*')
    const fileTypeValid = acceptedFileTypes.some((type) => {
      if (type.includes('/*')) {
        const prefix = type.split('/*')[0]
        return file.type.startsWith(prefix)
      }
      return file.type === type
    })

    // Check file extension as fallback
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const extensionValid = acceptedExtensions.includes(fileExtension)

    if (!fileTypeValid && !extensionValid) {
      const extensions = acceptedExtensions.join(', ')
      return {
        valid: false,
        error: t('campaign.upload.upload_valid_file_error', { extensions }),
      }
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1)
      return {
        valid: false,
        error: t('campaign.upload.file_exceeds_limit_error', {
          max: maxSizeMB,
        }),
      }
    }

    return { valid: true }
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return

    const validation = validateFile(file)

    if (!validation.valid) {
      const errorMsg = validation.error || t('campaign.upload.invalid_file')

      if (onValidationError) {
        onValidationError(errorMsg)
      } else {
        toast.error(errorMsg, {
          position: 'bottom-right',
          duration: 3000,
        })
      }
      return
    }

    setUploadState({ file, progress: 0, uploading: false })

    // Call onFileSelect callback
    if (onFileSelect) {
      onFileSelect(file)
    }

    // If onFileUpload is provided, call it automatically
    if (onFileUpload) {
      setUploadState((prev) => ({ ...prev, uploading: true }))
      try {
        await onFileUpload(file)
        setUploadState((prev) => ({ ...prev, progress: 100, uploading: false }))
      } catch (error) {
        setUploadState((prev) => ({ ...prev, uploading: false }))
        const errorMsg =
          error instanceof Error
            ? error.message
            : t('campaign.upload.upload_failed')
        toast.error(errorMsg, {
          position: 'bottom-right',
          duration: 3000,
        })
      }
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0])
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  const resetFile = () => {
    setUploadState({ file: null, progress: 0, uploading: false })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onFileRemove) {
      onFileRemove()
    }
  }

  const getFileIcon = () => {
    if (CustomFileIcon) {
      return <CustomFileIcon className="h-5 w-5 text-foreground" />
    }

    if (!uploadState.file) return <File className="h-5 w-5 text-foreground" />

    const fileExt = uploadState.file.name.split('.').pop()?.toLowerCase() || ''

    if (['csv', 'xlsx', 'xls'].includes(fileExt))
      return <FileSpreadsheet className="h-5 w-5 text-foreground" />
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt))
      return <FileImage className="h-5 w-5 text-foreground" />
    if (['pdf', 'txt', 'doc', 'docx', 'rtf'].includes(fileExt))
      return <FileText className="h-5 w-5 text-foreground" />
    if (['mp3', 'wav', 'ogg'].includes(fileExt))
      return <FileAudio className="h-5 w-5 text-foreground" />
    if (['mp4', 'webm', 'mov'].includes(fileExt))
      return <FileVideo className="h-5 w-5 text-foreground" />
    if (['zip', 'rar', 'tar', 'gz'].includes(fileExt))
      return <FileArchive className="h-5 w-5 text-foreground" />

    return <File className="h-5 w-5 text-foreground" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getAcceptString = () => acceptedExtensions.join(', ')
  const getFileTypesDescription = () => {
    const extensions = acceptedExtensions.map((ext) =>
      ext.replace('.', '').toUpperCase()
    )
    return t('campaign.upload.accepted_file_types', {
      types: extensions.join(', '),
    })
  }

  const { file } = uploadState

  const containerClass = compact
    ? 'w-full'
    : 'flex items-center justify-center p-10 w-full max-w-lg'

  return (
    <div className={`${containerClass} ${className}`}>
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        {title && !compact && (
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        )}

        <div
          className={`flex justify-center rounded-md border transition-all duration-200 ${
            compact ? '' : 'mt-2'
          } border-dashed px-6 ${compact ? 'py-8' : 'py-12'} ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-input hover:bg-muted/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="pointer-events-none flex flex-col items-center">
            <Icon
              className={`mx-auto ${
                compact ? 'h-8 w-8' : 'h-12 w-12'
              } ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}
              aria-hidden={true}
            />
            <div
              className={`mt-4 flex text-sm leading-6 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {isDragging ? (
                <p className="font-semibold">{dropText}</p>
              ) : (
                <div className="flex pointer-events-auto">
                  <p>{dragDropText}</p>
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
                  >
                    <span>{chooseFileText}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept={getAcceptString()}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">{toUploadText}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {description ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
            <span>{getFileTypesDescription()}</span>
            <span className="pl-1 sm:pl-0">
              {t('campaign.upload.max_size', {
                size: (maxFileSize / (1024 * 1024)).toFixed(0),
              })}
            </span>
          </p>
        )}

        {!file && showDummy && (
          <Card className="relative mt-8 bg-muted p-4 gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label={t('common.cancel')}
              onClick={() => setShowDummy(false)}
            >
              <X className="h-5 w-5 shrink-0" aria-hidden={true} />
            </Button>

            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                <FileSpreadsheet
                  className="h-5 w-5 text-foreground"
                  aria-hidden={true}
                />
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">
                  Example_File.xlsx
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">3.1 MB</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Progress value={45} className="h-1.5" />
              <span className="text-xs text-muted-foreground">45%</span>
            </div>
          </Card>
        )}

        {file && (
          <Card className="relative mt-2 bg-muted p-4 gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label={t('common.cancel')}
              onClick={resetFile}
            >
              <X className="h-5 w-5 shrink-0" aria-hidden={true} />
            </Button>

            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                {getFileIcon()}
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {file?.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {file && formatFileSize(file.size)}
                </p>
              </div>
            </div>

            {(uploading || progress > 0) && (
              <div className="flex items-center space-x-3">
                <Progress value={progress} className="h-1.5" />
                <span className="text-xs text-muted-foreground">
                  {progress}%
                </span>
              </div>
            )}
          </Card>
        )}

        {/* Actualmente no se muestran, pero si se ocupan a futuro, ya cuentan con traducción.  */}
        {showActionButtons && (
          <div className="mt-8 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap"
              onClick={resetFile}
              disabled={!file}
            >
              {cancelButtonText === 'Cancel'
                ? t('common.cancel')
                : cancelButtonText}
            </Button>
            <Button
              type="submit"
              className="whitespace-nowrap"
              disabled={!file || uploading || (progress > 0 && progress < 100)}
              onClick={() => file && onFileUpload && onFileUpload(file)}
            >
              {uploadButtonText === 'Upload'
                ? t('common.upload')
                : uploadButtonText}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
