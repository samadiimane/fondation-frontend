"use client";
import {useLocale} from "next-intl";

import {getTeamInnerContent} from "@/content/teamInner";
import {isRtlLocale} from "@/i18n/config";

const TeamInner = () => {
  const locale = useLocale();
  const content = getTeamInnerContent(locale);
  const isRtl = isRtlLocale(locale);
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <section
      className='team-directory structure-page'
      dir={dir}
      aria-labelledby='team-directory-title'
    >
      <div className='container'>
        <header className='team-directory__header section__header text-center'>
          <h2 id='team-directory-title' className='title-animation_inner'>
            {content.title}
          </h2>
          <p>{content.intro}</p>
        </header>

        <ul className='team-directory__list' aria-label={content.title}>
          {content.members.map((member) => (
            <li className='team-directory__item' key={member.id}>
              <article className='team-directory__member'>
                <div className='team-directory__identity'>
                  <h5>{member.name}</h5>
                </div>

                <dl className='team-directory__meta'>
                  <div>
                    <dt>{content.labels.profile}</dt>
                    <dd>{member.profile}</dd>
                  </div>

                  <div>
                    <dt>{content.labels.role}</dt>
                    <dd>{member.role}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamInner;
