// src/components/quote/FileUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface FileUploadProps {
    onFilesChange: (urls: string[]) => void
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    console.log('[FileUpload] Mounted | Ready for uploads')

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        // Max 3 files, max 5MB each
        const validFiles = files.filter(f => {
            const isValidType = f.type.startsWith('image/') || f.type === 'application/pdf'
            const isValidSize = f.size <= 5 * 1024 * 1024 // 5MB
            if (!isValidType) console.warn('[FileUpload] Invalid type:', f.name)
            if (!isValidSize) console.warn('[FileUpload] Too large:', f.name, f.size)
            return isValidType && isValidSize
        })

        if (validFiles.length > 3) {
            alert('Max 3 files allowed')
            return
        }

        console.log('[FileUpload] Files selected:', validFiles.map(f => f.name))
        setSelectedFiles(validFiles)
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0 || uploading) return
        setUploading(true)
        console.log('[FileUpload] Starting upload:', selectedFiles.length, 'files')

        const urls: string[] = []
        try {
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
                const filePath = `quote-files/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('quote-files')
                    .upload(filePath, file, { upsert: false })

                if (uploadError) throw uploadError

                const { data: urlData } = supabase.storage.from('quote-files').getPublicUrl(filePath)
                urls.push(urlData.publicUrl)
                console.log('[FileUpload] Uploaded:', file.name, '→', urlData.publicUrl)
            }

            setUploadedUrls(urls)
            onFilesChange(urls)
            setSelectedFiles([]) // Clear selection after successful upload
        } catch (err) {
            console.error('[FileUpload] Upload failed:', err)
            alert('File upload failed. You can still submit the quote and send files via WhatsApp.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Attach reference images or specs (optional)
            </label>

            <div className="flex items-center gap-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                    multiple
                    className="hidden"
                    id="file-upload"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Choose Files'}
                </button>

                {selectedFiles.length > 0 && (
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                )}
            </div>

            {selectedFiles.length > 0 && (
                <ul className="text-xs text-gray-500 space-y-1">
                    {selectedFiles.map((f, i) => (
                        <li key={i}>📎 {f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                    ))}
                </ul>
            )}

            {uploadedUrls.length > 0 && (
                <p className="text-xs text-green-600">✅ {uploadedUrls.length} file(s) attached</p>
            )}
        </div>
    )
}