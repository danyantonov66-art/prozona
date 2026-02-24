// components/category/ProZonaCategoryCard.tsx
import Link from "next/link";

export default function ProZonaCategoryCard({ data }) {
  return (
    <Link href={`/categories/${data.slug}`}>
      <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors group cursor-pointer">
        <div className="text-3xl mb-4">{data.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#1DB954] transition-colors">
          {data.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{data.description}</p>
        <span className="text-[#1DB954] group-hover:underline">Виж услугите →</span>
      </div>
    </Link>
  );
}