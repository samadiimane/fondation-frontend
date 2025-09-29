"use client";
import Link from "next/link";

const TeamInner = () => {
  const scientificTeam = [
    {
      id: 1,
      name: "Dr. Abdelaziz Khallouk Temsamani",
      position: "Founder & Scientific Director",
      image: "assets/images/team/ceo.jpg",
      specialization: "Moroccan Modern & Contemporary History",
      education: "PhD in History, Mohammed V University",
      experience: "30+ years in historical research",
      publications: "50+ books and research papers",
      expertise: ["Historical Documentation", "Manuscript Analysis", "Academic Publishing"]
    },
    {
      id: 2,
      name: "Prof. Fatima Al-Khamlichi",
      position: "Senior Historical Researcher",
      image: "assets/images/team/woman.png",
      specialization: "Medieval Moroccan History",
      education: "PhD in Islamic Studies, Al-Quaraouiyine University",
      experience: "25+ years in medieval studies",
      publications: "35+ academic publications",
      expertise: ["Islamic Manuscripts", "Andalusian Heritage", "Paleography"]
    },
    {
      id: 3,
      name: "Dr. Ahmed Benali",
      position: "Digital Humanities Specialist",
      image: "assets/images/team/ceoo.jpg",
      specialization: "Digital Archives & AI Research",
      education: "PhD in Information Sciences, Rabat University",
      experience: "15+ years in digital preservation",
      publications: "20+ papers on digital humanities",
      expertise: ["Digital Preservation", "Semantic Search", "Database Management"]
    },
    {
      id: 4,
      name: "Prof. Aicha Moroccan",
      position: "Cultural Heritage Expert",
      image: "assets/images/team/woman.png",
      specialization: "Tangible & Intangible Heritage",
      education: "PhD in Anthropology, Sorbonne University",
      experience: "20+ years in heritage studies",
      publications: "40+ studies on Moroccan culture",
      expertise: ["Cultural Documentation", "Ethnographic Studies", "Heritage Preservation"]
    }
  ];

  const scientificCommittee = [
    {
      id: 1,
      name: "Prof. Mohammed Berrada",
      position: "Committee Chairman",
      image: "assets/images/team/ceooo.jpg",
      specialization: "Research Quality Assurance",
      education: "PhD in History, Harvard University",
      experience: "35+ years in academic review",
      publications: "60+ peer-reviewed articles",
      expertise: ["Academic Standards", "Peer Review", "Quality Control"]
    },
    {
      id: 2,
      name: "Dr. Latifa Bennani",
      position: "Editorial Review Specialist",
      image: "assets/images/team/ceoo.jpg",
      specialization: "Academic Publishing Standards",
      education: "PhD in Literature, Oxford University",
      experience: "20+ years in academic editing",
      publications: "Editor of 100+ academic works",
      expertise: ["Editorial Standards", "Academic Writing", "Publication Ethics"]
    },
    {
      id: 3,
      name: "Prof. Youssef Tazi",
      position: "Methodology Advisor",
      image: "assets/images/team/ceo.jpg",
      specialization: "Research Methodology",
      education: "PhD in Social Sciences, EHESS Paris",
      experience: "25+ years in research methodology",
      publications: "30+ methodological guides",
      expertise: ["Research Design", "Data Analysis", "Academic Standards"]
    },
    {
      id: 4,
      name: "Dr. Khadija Alami",
      position: "International Relations Coordinator",
      image: "assets/images/team/woman.png",
      specialization: "Academic Partnerships",
      education: "PhD in International Relations, Sciences Po",
      experience: "18+ years in academic diplomacy",
      publications: "25+ papers on academic cooperation",
      expertise: ["Partnership Development", "International Standards", "Academic Networks"]
    }
  ];

  const TeamCard = ({ member, delay = 0 }) => (
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
            <p className='position'>{member.position}</p>
            <p className='specialization'>{member.specialization}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className='team structure-page'>
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
                Scientific <span>Team</span> & Research Supervisors
              </h2>
              <p>
                Distinguished historians and researchers who guide our foundation's 
                scholarly endeavors and ensure the highest academic standards.
              </p>
            </div>
          </div>
        </div>
        
        <div className='row gutter-30 mb-5'>
          {scientificTeam.map((member, index) => (
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
                Quality Assurance
              </span>
              <h2 className='title-animation_inner'>
                Scientific <span>Committee</span> & Quality Control
              </h2>
              <p>
                Expert reviewers responsible for maintaining rigorous academic standards, 
                peer review processes, and ensuring research quality across all publications.
              </p>
            </div>
          </div>
        </div>
        
        <div className='row gutter-30'>
          {scientificCommittee.map((member, index) => (
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