"use client"

import dynamic from "next/dynamic"

const SpecialistsMap = dynamic(() => import("./SpecialistsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-2xl bg-[#151528] border border-white/10 flex items-center justify-center text-gray-400">
      Зареждане на картата...
    </div>
  )
})

interface Specialist {
  id: string
  name: string
  city: string
  lat: number
  lng: number
}

interface Props {
  specialists: Specialist[]
  locale: string
}

export default function SpecialistsMapWrapper({ specialists, locale }: Props) {
  return <SpecialistsMap specialists={specialists} locale={locale} />
}