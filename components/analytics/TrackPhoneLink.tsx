"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

type Props = {
  phone: string;
  specialistId: string;
  specialistName: string;
  city?: string | null;
};

export default function TrackPhoneLink({
  phone,
  specialistId,
  specialistName,
  city,
}: Props) {
  const onClick = useCallback(() => {
    // GA4
    window.gtag?.("event", "click_phone", {
      specialist_id: specialistId,
      specialist_name: specialistName,
      phone,
      city: city ?? undefined,
    });

    // Meta Pixel
    window.fbq?.("trackCustom", "ClickPhone", {
      specialist_id: specialistId,
      specialist_name: specialistName,
      phone,
      city: city ?? undefined,
    });
  }, [phone, specialistId, specialistName, city]);

  const tel = phone.replace(/\s+/g, "");

  return (
    <a
      href={`tel:${tel}`}
      onClick={onClick}
      className="text-gray-400 mt-1 underline decoration-transparent hover:decoration-[#1DB954] hover:text-white transition"
    >
      {phone}
    </a>
  );
}