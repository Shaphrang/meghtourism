"use client";
import AverageRating from "./averageRating";
import ReviewForm from "./reviewForm";
import ReviewList from "./reviewList";

interface Props {
  category: string;
  itemId: string;
}

export default function ReviewSection({ category, itemId }: Props) {
  return (
    <section className="mt-6 space-y-4">
      <ReviewForm category={category} itemId={itemId} />
      <ReviewList category={category} itemId={itemId} />
    </section>
  );
}