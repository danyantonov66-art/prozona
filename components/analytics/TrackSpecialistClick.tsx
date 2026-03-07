"use client";

import { useCallback } from "react";

type Props = {
  specialistId: string;
  specialistName: string;
  city?: string | null;
  category?: string | null;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export default function TrackSpecialistClick(props: Props) {
  const onClick = useCallback(() => {
    window.gtag?.("event", "view_specialist", {
      specialist_id: props.specialistId,
      specialist_name: props.specialistName,
      city: props.city ?? undefined,
      category: props.category ?? undefined,
    });

    window.fbq?.("trackCustom", "ViewSpecialist", {
      specialist_id: props.specialistId,
      specialist_name: props.specialistName,
      city: props.city ?? undefined,
      category: props.category ?? undefined,
    });
  }, [props]);

  return <span onClick={onClick} style={{ display: "contents" }} />;
}
