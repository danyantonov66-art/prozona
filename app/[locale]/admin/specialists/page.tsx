"use client";

import { useEffect, useState } from "react";

export default function AdminSpecialistsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/specialists/pending", { cache: "no-store" });
    const data = await res.json();
    setItems(data.specialists ?? []);
    setLoading(false);
  }

  async function approve(id: string) {
    await fetch("/api/admin/specialists/" + id + "/approve", { method: "POST" });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 30 }}>
      <h1>Чакащи специалисти</h1>

      {loading && <p>Зареждане...</p>}
      {!loading && items.length === 0 && <p>Няма чакащи.</p>}

      {items.map((s) => (
        <div key={s.id} style={{ border: "1px solid #333", padding: 12, marginTop: 12 }}>
          <div><b>{s.user?.name}</b></div>
          <div>{s.user?.email}</div>
          <button onClick={() => approve(s.id)}>Одобри</button>
        </div>
      ))}
    </main>
  );
}
