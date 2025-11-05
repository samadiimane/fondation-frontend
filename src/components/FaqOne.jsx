const DEFAULT_ITEMS = [
  {
    question: "What kind of recipes can I find on your website?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
  {
    question: "Are the recipes suitable for beginners?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
  {
    question: "Do you offer cooking tips and techniques?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
  {
    question: "How frequently do you update your recipe collection?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
];

const FaqOne = ({
  subTitle = "Start donating poor people",
  subTitleIcon = "icon-donation",
  titlePrimary = "Frequently",
  titleHighlight = "Asked",
  titleSuffix = "Questions",
  description = "",
  items = DEFAULT_ITEMS,
  emptyMessage = "FAQs will be published soon.",
  heroImages = {
    large: { src: "assets/images/faq/thumb-lg.png", alt: "FAQ illustration" },
    small: { src: "assets/images/faq/thumb-sm.png", alt: "FAQ detail" },
  },
  shapeImage = { src: "assets/images/faq/shape.png", alt: "Background shape" },
}) => {
  const faqItems = Array.isArray(items) && items.length > 0 ? items : [];
  const hasFaq = faqItems.length > 0;

  return (
    <section className='faq'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-12 col-lg-8 col-xl-6'>
            <div className='faq__content'>
              <div className='section__content' data-aos='fade-up' data-aos-duration={1000}>
                <span className='sub-title'>
                  {subTitleIcon ? <i className={subTitleIcon} /> : null}
                  {subTitle}
                </span>
                <h2 className='title-animation_inner'>
                  {titlePrimary}
                  {titleHighlight ? (
                    <>
                      {" "}
                      <span>{titleHighlight}</span>
                    </>
                  ) : null}
                  {titleSuffix ? <> {titleSuffix}</> : null}
                </h2>
                {description ? <p>{description}</p> : null}
              </div>
              <div className='faq__content-inner cta' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={100}>
                {hasFaq ? (
                  <div className='accordion' id='accordion'>
                    {faqItems.map((item, index) => {
                      const collapseId = `faq-collapse-${index}`;
                      const headingId = `faq-heading-${index}`;
                      const isFirst = index === 0;
                      return (
                        <div className='accordion-item' key={collapseId}>
                          <h6 className='accordion-header' id={headingId}>
                            <button
                              className={`accordion-button ${isFirst ? "" : "collapsed"}`}
                              type='button'
                              data-bs-toggle='collapse'
                              data-bs-target={`#${collapseId}`}
                              aria-expanded={isFirst ? "true" : "false"}
                              aria-controls={collapseId}
                            >
                              {item?.question ?? ""}
                            </button>
                          </h6>
                          <div
                            id={collapseId}
                            className={`accordion-collapse collapse ${isFirst ? "show" : ""}`}
                            aria-labelledby={headingId}
                            data-bs-parent='#accordion'
                          >
                            <div className='accordion-body'>
                              <p>{item?.answer ?? ""}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='faq__empty'>
                    <p>{emptyMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-4 col-xl-5 offset-xl-1'>
            <div className='faq__thumb d-none d-lg-block'>
              <div className='faq__thumb-inner'>
                {heroImages?.large ? (
                  <div className='thumb-lg' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={100}>
                    <img src={heroImages.large.src} alt={heroImages.large.alt ?? "FAQ illustration"} />
                  </div>
                ) : null}
                {heroImages?.small ? (
                  <div className='thumb-sm' data-aos='fade-left' data-aos-duration={1000} data-aos-delay={300}>
                    <img src={heroImages.small.src} alt={heroImages.small.alt ?? "FAQ detail"} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      {shapeImage ? (
        <div className='shape d-none d-lg-block'>
          <img src={shapeImage.src} alt={shapeImage.alt ?? "Background shape"} />
        </div>
      ) : null}
    </section>
  );
};

export default FaqOne;
