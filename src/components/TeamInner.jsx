"use client";
import Link from "next/link";
import {useLocale} from "next-intl";

import {getTeamInnerContent} from "@/content/teamInner";
import {isRtlLocale} from "@/i18n/config";

const TeamInner = () => {
  const locale = useLocale();
  const content = getTeamInnerContent(locale);
  const isRtl = isRtlLocale(locale);
  const textAlign = isRtl ? "text-end" : "text-start";
  const dir = isRtl ? "rtl" : "ltr";

  const TeamCard = ({member, delay = 0}) => (
    <div className='col-12 col-sm-6 col-lg-4 col-xl-3'>
      <div
        className='team__single-wrapper'
        data-aos='fade-up'
        data-aos-duration={1000}
        data-aos-delay={delay}
      >
        <div className='team__single van-tilt'>
          <div className='team__single-thumb'>
            <Link href='/team-details'>
              <img src={member.image} alt={member.name} />
            </Link>
            <div className='team__details-overlay'>
              <div className='team__details-content'>
                <div className='member-stats'>
                  <div className='stat-item'>
                    <i className='fa-solid fa-graduation-cap'></i>
                    <span>{member.education}</span>
                  </div>
                  <div className='stat-item'>
                    <i className='fa-solid fa-clock'></i>
                    <span>{member.experience}</span>
                  </div>
                  <div className='stat-item'>
                    <i className='fa-solid fa-book'></i>
                    <span>{member.publications}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='team__single-content'>
            <h6>
              <Link href='/team-details'>{member.name}</Link>
            </h6>
            <p className={`position ${textAlign}`}>{member.position}</p>
            <p className={`specialization ${textAlign}`}>{member.specialization}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className='team structure-page' dir={dir}>
      <div className='container'>
        {/* Scientific Team Section */}
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <h2 className='title-animation_inner'>
                {content.scientific.title}
              </h2>
              <p className={textAlign}>
                {content.scientific.description}
              </p>
            </div>
          </div>
        </div>

        <div className='row gutter-30 mb-5'>
          {content.scientific.members.map((member, index) => (
            <TeamCard
              key={member.id}
              member={member}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Scientific Committee Section */}
        <div className='row justify-content-center mt-5 pt-5'>
          <div className='col-12 col-lg-10 col-xl-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>
                <i className='fa-solid fa-balance-scale' />
                {content.committee.subtitle}
              </span>
              <h2 className='title-animation_inner'>
                {content.committee.title}
              </h2>
              <p className={textAlign}>
                {content.committee.description}
              </p>
            </div>
          </div>
        </div>

        <div className='row gutter-30'>
          {content.committee.members.map((member, index) => (
            <TeamCard
              key={member.id}
              member={member}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamInner;
