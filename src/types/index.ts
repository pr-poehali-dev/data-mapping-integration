import type { ReactNode } from "react"

export interface GalleryItem {
  src: string
  label: string
}

export interface Section {
  id: string
  title: string
  subtitle?: ReactNode
  content?: string
  showButton?: boolean
  buttonText?: string
  gallery?: GalleryItem[]
}

export interface SectionProps extends Section {
  isActive: boolean
}