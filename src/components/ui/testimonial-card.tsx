import Image, { StaticImageData } from "next/image"
import { Star } from "lucide-react"
import person from "@/assets/images/Human.png"

interface TestimonialCardProps {
  rating: number
  maxRating?: number
  review: string
  userName: string
  userTitle: string
  userImage: string | StaticImageData
  className?: string
}


export default function TestimonialCard({
  rating,
  maxRating = 5,
  review,
  userName,
  userTitle,
  userImage,
  className = "",
}: TestimonialCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-md ${className}`}>
      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: maxRating }, (_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${index < rating ? "fill-blue-400 text-blue-400" : "fill-none text-gray-300"}`}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {review.length > 200 ? review.substring(0, 200) + "..." : review}
      </p>

      {/* User Profile */}
      <div className="flex items-center gap-3 pt-6 border-gray-200 border-t">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={userImage || person}
            alt={`${userName} profile picture`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{userName}</h4>
          <p className="text-gray-500 text-sm">{userTitle}</p>
        </div>
      </div>
    </div>
  )
}
