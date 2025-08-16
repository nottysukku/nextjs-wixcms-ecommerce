import Image from "next/image";

const Reviews = async ({ productId }: { productId: string }) => {
  try {
    // Check if FERA_ID is configured
    if (!process.env.NEXT_PUBLIC_FERA_ID) {
      console.warn("NEXT_PUBLIC_FERA_ID is not configured");
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Reviews service not configured</p>
        </div>
      );
    }

    const reviewRes = await fetch(
      `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
    );

    if (!reviewRes.ok) {
      console.error(`Reviews API error: ${reviewRes.status} ${reviewRes.statusText}`);
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Unable to load reviews</p>
        </div>
      );
    }

    const reviews = await reviewRes.json();
    
    console.log("Reviews response:", reviews); // Debug log

    // Check if reviews data exists and is an array
    if (!reviews || !reviews.data || !Array.isArray(reviews.data)) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews available</p>
        </div>
      );
    }

    // If no reviews found
    if (reviews.data.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {reviews.data.map((review: any) => (
          <div className="flex flex-col gap-4 p-4 border rounded-lg" key={review.id}>
            {/* USER */}
            <div className="flex items-center gap-4 font-medium">
              {review.customer?.avatar_url ? (
                <Image
                  src={review.customer.avatar_url}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    {review.customer?.display_name?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <span>{review.customer?.display_name || "Anonymous"}</span>
            </div>
            {/* STARS */}
            <div className="flex gap-2">
              {Array.from({ length: Math.min(review.rating || 0, 5) }).map((_, index) => (
                <Image src="/star.png" alt="" key={index} width={16} height={16} />
              ))}
              {Array.from({ length: Math.max(5 - (review.rating || 0), 0) }).map((_, index) => (
                <div key={index} className="w-4 h-4 border border-gray-300 rounded-sm"></div>
              ))}
            </div>
            {/* DESC */}
            {review.heading && <p className="font-semibold">{review.heading}</p>}
            {review.body && <p className="text-gray-700">{review.body}</p>}
            {/* MEDIA */}
            {review.media && review.media.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {review.media.map((media: any) => (
                  <Image
                    src={media.url}
                    key={media.id}
                    alt=""
                    width={100}
                    height={50}
                    className="object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Error loading reviews. Please try again later.</p>
      </div>
    );
  }
};

export default Reviews;
