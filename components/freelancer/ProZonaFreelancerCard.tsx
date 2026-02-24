export default function ProZonaFreelancerCard({ data }: { data: any }) {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold">{data.name}</h3>
      <p className="text-gray-400">{data.profession}</p>
      <div className="flex items-center mt-2">
        <span className="text-yellow-400">★</span>
        <span className="text-white ml-1">{data.rating}</span>
        <span className="text-gray-400 ml-2">({data.reviews} отзива)</span>
      </div>
      <p className="text-gray-400 mt-2">{data.location}</p>
      <p className="text-[#1DB954] font-semibold mt-2">{data.hourlyRate} лв/час</p>
      <p className="text-green-500 text-sm mt-1">{data.jobSuccess}% успеваемост</p>
    </div>
  );
}