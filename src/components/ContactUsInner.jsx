const DEFAULT_SOCIAL_LINKS = [
  { href: "https://www.facebook.com/", icon: "fa-brands fa-facebook-f", label: "facebook" },
  { href: "https://vimeo.com/", icon: "fa-brands fa-vimeo-v", label: "vimeo" },
  { href: "https://x.com/", icon: "fa-brands fa-twitter", label: "twitter" },
  { href: "https://www.linkedin.com/", icon: "fa-brands fa-linkedin-in", label: "linkedin" },
];

const DEFAULT_PHONE_NUMBERS = ["+1 (368) 567 89 54", "+236 (456) 896 22"];
const DEFAULT_EMAIL_ADDRESSES = ["example@email.com", "charifund@email.com"];

const ContactUsInner = ({
  subTitle = "Get In Touch",
  subTitleIcon = "icon-donation",
  title = "Contact Us",
  description = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque inventore",
  address,
  mapLink = "https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8",
  phoneNumbers = DEFAULT_PHONE_NUMBERS,
  emailAddresses = DEFAULT_EMAIL_ADDRESSES,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  emptyMessage = "Contact information will be available soon.",
  heroImage = { src: "assets/images/contact-thumb.png", alt: "Contact illustration" },
  showForm = true,
  formTitle = "Fill Up The Form",
  formDescription = "Your email address will not be published. Required fields are marked *",
}) => {
  const sanitizedPhones = (Array.isArray(phoneNumbers) ? phoneNumbers : []).filter(Boolean);
  const sanitizedEmails = (Array.isArray(emailAddresses) ? emailAddresses : []).filter(Boolean);
  const sanitizedSocials = (Array.isArray(socialLinks) ? socialLinks : []).filter((link) => link?.href && link?.icon);
  const hasDetails = Boolean(address || sanitizedPhones.length || sanitizedEmails.length || sanitizedSocials.length);

  return (
    <section className='contact-main volunteer'>
      <div className='container'>
        <div className='row gutter-40'>
          <div className='col-12 col-xl-6'>
            <div className='contact__content'>
              <div className='section__content' data-aos='fade-up' data-aos-duration={1000}>
                <span className='sub-title'>
                  {subTitleIcon ? <i className={subTitleIcon} /> : null}
                  {subTitle}
                </span>
                <h2 className='title-animation_inner'>{title}</h2>
                {description ? <p>{description}</p> : null}
              </div>
              <div className='contact-main__inner cta'>
                {hasDetails ? (
                  <>
                    {address ? (
                      <div className='contact-main__single'>
                        <div className='thumb'>
                          <i className='fa-solid fa-location-dot' />
                        </div>
                        <div className='content'>
                          <h6>Location</h6>
                          <p>
                            {mapLink ? (
                              <a href={mapLink} target='_blank' rel='noreferrer'>
                                {address}
                              </a>
                            ) : (
                              address
                            )}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {sanitizedPhones.length ? (
                      <div className='contact-main__single'>
                        <div className='thumb'>
                          <i className='fa-solid fa-phone' />
                        </div>
                        <div className='content'>
                          <h6>Phone</h6>
                          {sanitizedPhones.map((phone) => {
                            const tel = phone.replace(/\s+/g, "");
                            return (
                              <p key={phone}>
                                <a href={`tel:${tel}`}>{phone}</a>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                    {sanitizedEmails.length ? (
                      <div className='contact-main__single'>
                        <div className='thumb'>
                          <i className='fa-solid fa-envelope' />
                        </div>
                        <div className='content'>
                          <h6>Email</h6>
                          {sanitizedEmails.map((email) => (
                            <p key={email}>
                              <a href={`mailto:${email}`}>{email}</a>
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {sanitizedSocials.length ? (
                      <div className='contact-main__single'>
                        <div className='thumb'>
                          <i className='fa-solid fa-share-nodes' />
                        </div>
                        <div className='content'>
                          <h6>Social</h6>
                          <div className='social'>
                            {sanitizedSocials.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target='_blank'
                                aria-label={`share us on ${link.label ?? "social"}`}
                                title={link.label ?? "social"}
                                rel='noreferrer'
                              >
                                <i className={link.icon} />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className='contact-main__single'>
                    <div className='content'>
                      <p>{emptyMessage}</p>
                    </div>
                  </div>
                )}
              </div>
              {heroImage ? (
                <div className='contact-main__thumb cta'>
                  <img src={heroImage.src} alt={heroImage.alt ?? "Contact illustration"} />
                </div>
              ) : null}
            </div>
          </div>
          {showForm ? (
            <div className='col-12 col-xl-6'>
              <div className='contact__form volunteer__form checkout__form' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={100}>
                <div className='volunteer__form-content'>
                  <h4 className='title-animation_inner'>{formTitle}</h4>
                  {formDescription ? <p>{formDescription}</p> : null}
                </div>
                <form action='#' method='post' className='cta'>
                  <div className='input-single'>
                    <input type='text' name='full-name' id='fullName' placeholder='Enter Name' required='' />
                    <i className='fa-solid fa-user' />
                  </div>
                  <div className='input-single'>
                    <input type='email' name='c-email' id='cEmail' placeholder='Enter Email' required='' />
                    <i className='fa-solid fa-envelope' />
                  </div>
                  <div className='input-single'>
                    <input type='text' name='phone-number' id='phoneNumber' placeholder='Phone Number' required='' />
                    <i className='fa-solid fa-phone' />
                  </div>
                  <div className='input-single alter-input '>
                    <textarea name='contact-message' id='contactMessage' placeholder='Your Message...' defaultValue='' />
                    <i className='fa-solid fa-comments' />
                  </div>
                  <div className='form-cta'>
                    <button type='submit' aria-label='submit message' title='submit message' className='btn--primary'>
                      Get A Quote <i className='fa-solid fa-arrow-right' />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ContactUsInner;
