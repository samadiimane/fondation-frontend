const DEFAULT_PHONE_NUMBERS = [];
const DEFAULT_EMAIL_ADDRESSES = [];

const ContactUsInner = ({
  description = "",
  address,
  mapLink = "",
  phoneNumbers = DEFAULT_PHONE_NUMBERS,
  emailAddresses = DEFAULT_EMAIL_ADDRESSES,
  officeHours = [],
  focusAreas = [],
  responseTime = "",
  labels = {},
  ctaLabel = "Email support desk",
  emptyMessage = "Contact information will be available soon.",
}) => {
  const sanitizedPhones = (Array.isArray(phoneNumbers) ? phoneNumbers : []).filter(Boolean);
  const sanitizedEmails = (Array.isArray(emailAddresses) ? emailAddresses : []).filter(Boolean);
  const sanitizedHours = (Array.isArray(officeHours) ? officeHours : []).filter(Boolean);
  const sanitizedFocus = (Array.isArray(focusAreas) ? focusAreas : []).filter(Boolean);
  const sanitizedDescription = typeof description === "string" ? description.trim() : "";
  const hasDetails = Boolean(address || sanitizedPhones.length || sanitizedEmails.length);
  const primaryEmail = sanitizedEmails[0] ?? "";

  return (
    <div className='support-contact'>
      <div className='support-contact__grid'>
        <article className='article-detail__card article-detail__card--primary support-contact__card'>
          {sanitizedDescription ? (
            <p className='support-contact__lead' dir='auto'>
              {sanitizedDescription}
            </p>
          ) : null}

          {hasDetails ? (
            <dl className='support-contact__list'>
              {address ? (
                <div className='support-contact__row'>
                  <dt>{labels.address || "Address"}</dt>
                  <dd>
                    <span dir='auto'>{address}</span>
                  </dd>
                </div>
              ) : null}

              {sanitizedPhones.length ? (
                <div className='support-contact__row'>
                  <dt>{labels.phone || "Phone"}</dt>
                  <dd>
                    {sanitizedPhones.map((phone) => {
                      const tel = phone.replace(/\s+/g, "");
                      return (
                        <p key={phone}>
                          <a className='support-contact__value--latin' href={`tel:${tel}`} dir='ltr'>
                            {phone}
                          </a>
                        </p>
                      );
                    })}
                  </dd>
                </div>
              ) : null}

              {sanitizedEmails.length ? (
                <div className='support-contact__row'>
                  <dt>{labels.email || "Email"}</dt>
                  <dd>
                    {sanitizedEmails.map((email) => (
                      <p key={email}>
                        <a className='support-contact__value--latin' href={`mailto:${email}`} dir='ltr'>
                          {email}
                        </a>
                      </p>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className='support-contact__empty'>{emptyMessage}</p>
          )}
        </article>

        <aside className='article-detail__card support-contact__card support-contact__card--aside'>
          {sanitizedFocus.length ? (
            <div className='support-contact__aside-block'>
              <h4>{labels.focus || "Support scope"}:</h4>
              <ul>
                {sanitizedFocus.map((item) => (
                  <li key={item} dir='auto'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {sanitizedHours.length ? (
            <div className='support-contact__aside-block'>
              <h4>{labels.hours || "Office hours"}:</h4>
              <ul>
                {sanitizedHours.map((item) => (
                  <li key={item} dir='auto'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {responseTime ? (
            <p className='support-contact__response' dir='auto'>
              <strong>{labels.responseTime || "Response time"}:</strong> {responseTime}
            </p>
          ) : null}

          {primaryEmail ? (
            <a className='btn--primary support-contact__cta' href={`mailto:${primaryEmail}`}>
              {ctaLabel}
            </a>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default ContactUsInner;
