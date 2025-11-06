"use client";

const EventListSkeleton = ({ count = 6 }) => {
  return (
    <div className='row'>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className='col-12 col-md-6 col-xl-4 event__single-wrapper'>
          <div className='event-card__skeleton'>
            <div className='event-card__skeleton-thumb shimmer' />
            <div className='event-card__skeleton-meta shimmer' />
            <div className='event-card__skeleton-title shimmer' />
            <div className='event-card__skeleton-line shimmer' />
            <div className='event-card__skeleton-line shimmer' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventListSkeleton;
