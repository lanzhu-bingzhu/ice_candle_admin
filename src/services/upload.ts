import request from './api'

export interface UploadResult {
  url: string
}

export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<any, { data: UploadResult }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}