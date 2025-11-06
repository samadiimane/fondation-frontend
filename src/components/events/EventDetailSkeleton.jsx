"use client";

const EventDetailSkeleton = () => (
  <section className='cm-details pt-100 pb-120'>
    <div className='container'>
      <div className='row gutter-40'>
        <div className='col-12 col-xl-6'>
          <div className='cm-details__poster shimmer' />
        </div>
        <div className='col-12 col-xl-6'>
          <div className='cm-details__skeleton-meta'>
            <div className='cm-details__skeleton-line shimmer' />
            <div className='cm-details__skeleton-line shimmer' />
            <div className='cm-details__skeleton-line shimmer' />
          </div>
        </div>
      </div>
      <div className='cm-details__skeleton-body'>
        <div className='cm-details__skeleton-line shimmer' />
        <div className='cm-details__skeleton-line shimmer' />
        <div className='cm-details__skeleton-line shimmer' />
      </div>
    </div>
  </section>
);

export default EventDetailSkeleton;
