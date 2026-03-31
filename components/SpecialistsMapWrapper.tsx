"use client"

import dynamic from "next/dynamic"

const SpecialistsMap = dynamic(() => import("./SpecialistsMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "16px",
        background: "#151528",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666",
        fontSize: "14px",
      }}
    >
      Зарежда картата...
    </div>
  ),
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