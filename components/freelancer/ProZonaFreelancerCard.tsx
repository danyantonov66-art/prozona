interface FreelancerCardProps {
  data: {
    id: number
    name: string
    profession: string
    rating: number
    reviews: number
    location: string
    hourlyRate: number
    jobSuccess: number
  }
}

export default function ProZonaFreelancerCard({ data }: FreelancerCardProps) {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold">{data.name}</h3>
      <p className="text-gray-400">{data.profession}</p>
      <p className="text-[#1DB954]">{data.hourlyRate} лв/час</p>
    </div>
  )
}