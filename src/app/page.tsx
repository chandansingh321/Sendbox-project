'use client'

import { ReviewProvider } from '@/context/ReviewContext'
import { RapidReviewApp } from '@/components/RapidReviewApp'

export default function HomePage() {
  return (
    <ReviewProvider>
      <RapidReviewApp />
    </ReviewProvider>
  )
}
