"use client";
import { useState } from "react";
import Link from "next/link";

const AboutDoctor = () => {
  const [activeSection, setActiveSection] = useState("biography");

  const books = [
    {
      title: "Tetouan: Urban Development and Social Transformations (1850-1950)",
      publisher: "University of Abdelmalek Essaâdi Press",
      year: "1995",
      description: "A comprehensive study of urban evolution in Northern Morocco, examining the social and architectural transformations during a pivotal period in Moroccan history.",
      citations: "450+",
      downloads: "8,500+"
    },
    {
      title: "The Jewish Community of Northern Morocco: Coexistence and Cultural Exchange",
      publisher: "Moroccan Historical Society",
      year: "2001",
      description: "An in-depth exploration of Jewish-Muslim relations in pre-colonial Morocco, documenting centuries of cultural coexistence and mutual influence.",
      citations: "320+",
      downloads: "6,200+"
    },
    {
      title: "Historical Documents of the Moroccan Rif: Preservation and Analysis",
      publisher: "Center for Historical Studies",
      year: "2005",
      description: "Essential methodological approaches to preserving and analyzing historical documents from the Rif region, establishing new standards for archival work.",
      citations: "280+",
      downloads: "4,800+"
    }
  ];

  const testimonials = [
    {
      name: "Prof. Hassan El-Ouazzani",
      title: "Director, Institute of Maghreb Studies, University of Rabat",
      quote: "Dr. Temsamani's meticulous approach to archival research and his innovative methodologies have fundamentally changed how we study North African urban history. His work bridges the gap between academic research and community heritage preservation."
    },
    {
      name: "Dr. Fatima Benali",
      title: "Professor of Mediterranean Studies, University of Tunis",
      quote: "Working with Dr. Temsamani on the Jewish-Muslim coexistence project was transformative. His ability to uncover forgotten narratives and present them with scholarly rigor while maintaining cultural sensitivity is unparalleled."
    },
    {
      name: "Prof. Ahmed Tazi",
      title: "Former Student, now Director of Moroccan National Archives",
      quote: "Dr. Temsamani taught me that history is not just about dates and events, but about understanding the human stories that shape our present. His mentorship shaped my entire approach to historical preservation."
    }
  ];

  const researchAreas = [
    {
      title: "Urban History of Northern Morocco",
      description: "Comprehensive studies of urban development and social transformations in Tetouan and surrounding regions.",
      icon: "fa-solid fa-building"
    },
    {
      title: "Jewish-Muslim Relations in Pre-colonial Morocco",
      description: "Groundbreaking research on cultural coexistence and exchange between communities.",
      icon: "fa-solid fa-users"
    },
    {
      title: "Oral History Preservation Techniques",
      description: "Innovative methodologies for collecting, preserving, and analyzing oral historical narratives.",
      icon: "fa-solid fa-quote-left"
    },
    {
      title: "Archival Documentation Methodologies",
      description: "Development of systematic approaches to historical document preservation and analysis.",
      icon: "fa-solid fa-book"
    }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Main Hero Section */}
      <section className='difference-two'>
        <div className='container'>
          <div className='row gutter-40 align-items-center'>
            <div className='col-12 col-lg-4 col-xxl-4'>
              <div className='difference-two__thumb-wrapper'>
                <div
                  className='thumb-lg'
                  data-aos='fade-right'
                  data-aos-duration={1000}
                >
                  <img
                    src='assets/images/difference/temsamani.png'
                    alt='Dr. Abdelaziz Khallouk Temsamani'
                  />
                </div>
                <div className='doctor-info-card' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={300}>
                  <div className='info-item'>
                    <i className='fa-solid fa-clock'></i>
                    <span>1945 - 2010</span>
                  </div>
                  <div className='info-item'>
                    <i className='fa-solid fa-map-marker-alt'></i>
                    <span>Born in Tetouan, Morocco</span>
                  </div>
                  <div className='info-item'>
                    <i className='fa-solid fa-graduation-cap'></i>
                    <span>PhD in History</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-lg-8 col-xxl-8'>
              <div className='difference-two__tab'>
                <div className='difference-two__content'>
                  <h2 className='title-animation_inner'>
                    <span>Dr.</span> Abdelaziz Khallouk Temsamani
                  </h2>
                  <p className='doctor-subtitle'>Distinguished Moroccan Historian and Cultural Heritage Researcher</p>
                  <p className='mb-4'>
                    Dr. Abdelaziz Khallouk Temsamani (1945-2010) was a distinguished Moroccan historian and researcher whose work fundamentally shaped contemporary understanding of North African history and cultural heritage. Born in Tetouan, Morocco, Dr. Temsamani demonstrated exceptional academic promise from an early age.
                  </p>
                  <p className='mb-5'>
                    He pursued his higher education at the University of Mohammed V in Rabat, where he earned his doctorate in History with highest honors. His doctoral thesis on "Commercial and Cultural Relations Between Morocco and Andalusia" established the foundation for his lifelong research interests.
                  </p>

                  {/* Navigation Buttons */}
                  <div className='doctor-navigation'>
                    <button
                      className={`nav-btn ${activeSection === 'biography' ? 'active' : ''}`}
                      onClick={() => scrollToSection('biography')}
                    >
                      Biography
                    </button>
                    <button
                      className={`nav-btn ${activeSection === 'research' ? 'active' : ''}`}
                      onClick={() => scrollToSection('research')}
                    >
                      Research
                    </button>
                    <button
                      className={`nav-btn ${activeSection === 'publications' ? 'active' : ''}`}
                      onClick={() => scrollToSection('publications')}
                    >
                      Publications
                    </button>
                    <button
                      className={`nav-btn ${activeSection === 'testimonials' ? 'active' : ''}`}
                      onClick={() => scrollToSection('testimonials')}
                    >
                      Testimonials
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section id="biography" className='team' style={{ paddingTop: '60px' }}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-10'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>Academic <span>Biography</span></h2>
              </div>
            </div>
          </div>

          {/* Education Timeline */}
          <div className='row mb-5'>
            <div className='col-12'>
              <div className='education-timeline' data-aos='fade-up' data-aos-duration={1000}>
                <h3 className='section-subtitle mb-4'>
                  Education
                </h3>
                <div className='timeline'>
                  <div className='timeline-item'>
                    <div className='timeline-badge'>1975</div>
                    <div className='timeline-content'>
                      <h4>Ph.D. in History</h4>
                      <p className='institution'>University of Mohammed V, Rabat</p>
                      <p className='thesis'>Thesis: "Commercial and Cultural Relations Between Morocco and Andalusia"</p>
                    </div>
                  </div>
                  <div className='timeline-item'>
                    <div className='timeline-badge'>1968</div>
                    <div className='timeline-content'>
                      <h4>Licence in History</h4>
                      <p className='institution'>University of Mohammed V, Rabat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Timeline */}
          <div className='row'>
            <div className='col-12'>
              <div className='career-timeline' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={300}>
                <h3 className='section-subtitle mb-4'>
                  Academic Career
                </h3>
                <div className='timeline'>
                  {[
                    {
                      period: "1985-2010",
                      title: "Professor of Modern History",
                      institution: "University of Abdelmalek Essaâdi",
                      description: "Led groundbreaking research in North African urban history and cultural heritage preservation."
                    },
                    {
                      period: "1990-2005",
                      title: "Director",
                      institution: "Center for Historical and Social Studies, Tetouan",
                      description: "Established innovative methodologies for archival research and community engagement."
                    },
                    {
                      period: "1995-2010",
                      title: "Advisor to the Ministry of Culture",
                      institution: "Kingdom of Morocco",
                      description: "Provided expertise on heritage preservation and cultural documentation policies."
                    }
                  ].map((position, index) => (
                    <div key={index} className='timeline-item'>
                      <div className='timeline-badge'>{position.period}</div>
                      <div className='timeline-content'>
                        <h4>{position.title}</h4>
                        <p className='institution'>{position.institution}</p>
                        <p>{position.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section id="research" className='difference' style={{ background: '#f8f9fa' }}>
        <div className='container mb-4'>
          <div className='row justify-content-center p-2'>
            <div className='col-12 col-lg-10 col-xl-8'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>Research Areas & <span>Contributions</span></h2>
                <p>Dr. Temsamani's research methodology combined rigorous archival work with innovative interdisciplinary approaches, bridging history, sociology, and cultural anthropology.</p>
              </div>
            </div>
          </div>

          <div className='row g-4'>
            {researchAreas.map((area, index) => (
              <div key={index} className='col-lg-6' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={index * 200}>
                <div className='research-area-card'>
                  <div className='research-icon'>
                    <i className={area.icon}></i>
                  </div>
                  <div className='research-content'>
                    <h4>{area.title}</h4>
                    <p>{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className='blog'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-md-8 col-xl-8'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>Publications & <span>Notable Works</span></h2>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <h3 className='section-subtitle mb-4'>
                Landmark Publications
              </h3>
              <div className='publications-grid'>
                {books.map((book, index) => (
                  <div key={index} className='publication-card' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={index * 200}>
                    <div className='publication-header'>
                      <h4>{book.title}</h4>
                      <div className='publication-meta'>
                        <span>{book.publisher}</span>
                        <span className='year'>{book.year}</span>
                      </div>
                    </div>
                    <p className='publication-description'>{book.description}</p>
                    <div className='publication-stats'>
                      <div className='stats-left'>
                        <div className='stat'>
                          <i className='fa-solid fa-quote-left'></i>
                          <span>{book.citations} citations</span>
                        </div>
                        <div className='stat'>
                          <i className='fa-solid fa-download'></i>
                          <span>{book.downloads} downloads</span>
                        </div>
                      </div>
                      <Link href='/' className='view-more-btn'>
                        View More <i className="fa-solid fa-book-open"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Awards Section */}
              <div className='awards-section mt-5' data-aos='fade-up' data-aos-duration={1000}>
                <h3 className='section-subtitle mb-4'>
                  <i className='fa-solid fa-award'></i> Awards & Recognition
                </h3>
                <div className='awards-grid'>
                  {[
                    { year: "2008", award: "Moroccan Cultural Heritage Preservation Award" },
                    { year: "2005", award: "Excellence in Maghreb Studies Award" },
                    { year: "2000", award: "Outstanding Historical Research Award" },
                    { year: "1995", award: "Archival Preservation Innovation Award" }
                  ].map((award, index) => (
                    <div key={index} className='award-item'>
                      <div className='award-year'>{award.year}</div>
                      <div className='award-title'>{award.award}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className='team' style={{ background: '#f8f9fa' }}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-10'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>Testimonials & <span>Appreciation</span></h2>
              </div>
            </div>
          </div>

          <div className='row g-4'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='col-lg-4' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={index * 200}>
                <div className='testimonial-card'>
                  <div className='quote-icon'>
                    <i className='fa-solid fa-quote-left'></i>
                  </div>
                  <blockquote>"{testimonial.quote}"</blockquote>
                  <div className='testimonial-author'>
                    <h5>{testimonial.name}</h5>
                    <p>{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className='difference-two'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-12'>
              <div className='difference-two__content text-center'>
                <h2 className='title-animation_inner mb-4'>
                  <span>Legacy &</span> Philosophy
                </h2>
                <blockquote className='doctor-quote'>
                  "History is not just about studying the past, but about understanding the present to shape the future."
                </blockquote>

                <div className='philosophy-grid'>
                  <div className='philosophy-item' data-aos='fade-up' data-aos-duration={1000}>
                    <h4>Critical Analysis</h4>
                    <p>Emphasis on rigorous examination of primary sources and historical evidence.</p>
                  </div>
                  <div className='philosophy-item' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={200}>
                    <h4>Interdisciplinary Approach</h4>
                    <p>Integration of history, sociology, and cultural anthropology in research.</p>
                  </div>
                  <div className='philosophy-item' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={400}>
                    <h4>Community Engagement</h4>
                    <p>Active involvement of local communities in historical preservation efforts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutDoctor;