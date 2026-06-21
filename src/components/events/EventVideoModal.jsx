"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ModalVideo = dynamic(() => import("react-modal-video"), { ssr: false });

const EventVideoModal = ({ videoId, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='video-btn-wrapper event-detail-static__video-wrapper'>
        <button
          type='button'
          className='open-video-popup'
          onClick={() => setIsOpen(true)}
          aria-label={label}
        >
          <i className='icon-play' aria-hidden='true' />
        </button>
      </div>

      {isOpen ? (
        <ModalVideo
          channel='youtube'
          autoplay
          isOpen={isOpen}
          videoId={videoId}
          onClose={() => setIsOpen(false)}
          allowFullScreen
        />
      ) : null}
    </>
  );
};

export default EventVideoModal;
