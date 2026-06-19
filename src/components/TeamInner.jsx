"use client";
import {useLocale} from "next-intl";

import {getTeamInnerContent} from "@/content/teamInner";
import {isRtlLocale} from "@/i18n/config";

const TeamInner = () => {
  const locale = useLocale();
  const content = getTeamInnerContent(locale);
  const isRtl = isRtlLocale(locale);
  const dir = isRtl ? "rtl" : "ltr";
  const groups = content.groups.filter((group) => group.key === "research");

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

        <div className='team-directory__groups'>
          {groups.map((group) => (
            <section
              className='team-directory__group'
              key={group.key}
              aria-labelledby={`team-directory-${group.key}-title`}
            >
              <header className='team-directory__group-header'>
                <h3 id={`team-directory-${group.key}-title`} className='title-animation_inner'>
                  {group.title}
                </h3>
                <p>{group.description}</p>
              </header>

              <ul className='team-directory__list'>
                {group.members.map((member) => (
                  <li className='team-directory__item' key={member.id}>
                    <article className='team-directory__member'>
                      <div className='team-directory__identity'>
                        <h5>{member.name}</h5>
                        <p>{member.role}</p>
                      </div>

                      <dl className='team-directory__meta'>
                        <div>
                          <dt>{content.labels.field}</dt>
                          <dd>{member.field}</dd>
                        </div>

                        {member.affiliation ? (
                          <div>
                            <dt>{content.labels.affiliation}</dt>
                            <dd>{member.affiliation}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamInner;
