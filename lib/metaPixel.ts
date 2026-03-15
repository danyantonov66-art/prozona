declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export const pageview = () => {
  if (!window.fbq) return
  window.fbq('track', 'PageView')
}

export const trackViewContent = (
  contentName: string,
  contentCategory?: string,
  contentIds?: string[]
) => {
  if (!window.fbq) return

  window.fbq('track', 'ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
    content_ids: contentIds,
    content_type: 'product',
  })
}

export const trackLead = (label?: string) => {
  if (!window.fbq) return

  window.fbq('track', 'Lead', {
    content_name: label || 'Lead',
  })
}

export const trackCompleteRegistration = (label?: string) => {
  if (!window.fbq) return

  window.fbq('track', 'CompleteRegistration', {
    content_name: label || 'Specialist Registration',
    status: true,
  })
}