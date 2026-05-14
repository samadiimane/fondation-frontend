"use client";

type TimelineStep = {
  label: string;
  duration: string;
};

type TimelineProps = {
  steps: TimelineStep[];
};

const Timeline = ({ steps }: TimelineProps) => {
  if (!steps.length) return null;

  return (
    <div className="publishing-timeline">
      <ol className="publishing-timeline__list">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="publishing-timeline__item">
            <div className="publishing-timeline__step" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="publishing-timeline__content">
              <h3 className="publishing-timeline__label">{step.label}</h3>
              <p className="publishing-timeline__duration">{step.duration}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Timeline;
