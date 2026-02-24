// components/freelancer/ProZonaFreelancerCard.tsx
import Image from "next/image";
import Link from "next/link";

export default function ProZonaFreelancerCard({ data }) {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-[#0D0D1A] rounded-full flex items-center justify-center flex-shrink-0">
          {data.img ? (
            <Image 
              src={data.img} 
              alt={data.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-600">👤</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{data.name}</h3>
          <p className="text-gray-400 text-sm mb-2">{data.profession}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(data.rating)
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-600'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
            <span className="text-gray-400 text-sm ml-1">({data.reviews} отзива)</span>
          </div>

          {/* Location and rate */}
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-400">📍 {data.location}</span>
            <span className="text-gray-400">💰 {data.hourlyRate} лв./час</span>
            <span className="text-gray-400">📊 {data.jobSuccess}% успех</span>
          </div>
        </div>
      </div>

      {/* View profile button */}
      <Link 
        href={`/specialist/${data.id}`}
        className="mt-4 block w-full py-2 bg-[#1DB954] text-white text-center rounded-lg hover:bg-[#169b43] transition-colors"
      >
        Виж профил
      </Link>
    </div>
  );
}