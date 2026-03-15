'use client'

import { useEffect } from "react"
import { trackViewContent } from "@/lib/metaPixel"

type Props = {
  name: string
}

export default function TrackViewContent({ name }: Props) {
  useEffect(() => {
    trackViewContent(name)
  }, [name])

  return null
}