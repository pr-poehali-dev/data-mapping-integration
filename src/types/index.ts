import type { ReactNode } from "react"

export interface GalleryItem {
  src: string
  label: string
  duration?: string
}

export interface VideoGalleryItem {
  src: string
  label: string
  duration?: string
}

export interface Section {
  id: string
  title: string
  subtitle?: ReactNode
  content?: string
  showButton?: boolean
  buttonText?: string
  gallery?: GalleryItem[]
  videoGallery?: VideoGalleryItem[]
}

export interface SectionProps extends Section {
  isActive: boolean
}