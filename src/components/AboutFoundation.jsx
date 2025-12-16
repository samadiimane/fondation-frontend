import Link from "next/link";
import React from "react";
import Partner from "./Partner";
import CounterOne from "./CounterOne";

const AboutFoundation = () => {
    return (
        <>

            {/* HERO SECTION */}
            <section className='hero about-hero'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-12 col-xl-10'>
                            <div
                                className='section__header'
                                data-aos='fade-up'
                                data-aos-duration={900}
                            >
                                <h2 className='title-animation_inner text-center'>
                                    <span> Welcome </span> to Abdelaziz Khallouk Temsamani Research Foundation
                                </h2>
                                <p className='mt-3 text-justify'>
                                    Advancing rigorous scholarship on Morocco and North Africa by
                                    bridging classical research methods with cutting-edge digital
                                    humanities. We preserve, analyze, and disseminate knowledge for
                                    the global academic community while extending the scholarly
                                    legacy of Dr. Abdelaziz Khallouk Temsamani.
                                </p>
                                <div className='d-flex gap-3 justify-content-center mt-4'>
                                    <Link
                                        href='/our-causes'
                                        aria-label='about us'
                                        title='about us'
                                        className='btn--secondary'
                                    >
                                        Read More about Dr. Temsamani <i className='fa-solid fa-arrow-right' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOUNDATION HISTORY */}
            <section className='about about-history pt-0 mt-5'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-12 col-lg-8 col-xxl-7'>
                            <div
                                className='section__header'
                                data-aos='fade-up'
                                data-aos-duration={900}
                            >

                                <h2 className='title-animation_inner'>Foundation History</h2>
                                <p>
                                    The Foundation was established to sustain and advance the
                                    academic legacy of <strong>Dr. Abdelaziz Khallouk Temsamani</strong>,
                                    whose pioneering work in Moroccan and North African studies
                                    championed rigorous archival research, intellectual history,
                                    and cultural analysis. Inspired by his commitment to mentoring
                                    young scholars and to safeguarding fragile historical sources,
                                    the Foundation institutionalizes a programmatic approach to
                                    preservation, research, and open access dissemination.

                                </p>
                                <p className='mb-0'>
                                    From its inception, the Foundation has positioned itself as a
                                    trusted steward of documentary heritage and a hub for
                                    interdisciplinary inquiry—linking historians, sociologists,
                                    anthropologists, linguists, digital humanists, and information
                                    scientists across regions and institutions.
                                </p>
                            </div>
                        </div>

                        <div className='col-12 col-lg-3 col-xxl-5'>
                            <div className='difference-two__thumb-wrapper'>
                                <div className='difference-two__thumb mt-5'>
                                    <div
                                        className='thumb-lg p-5'
                                        data-aos='fade-right'
                                        data-aos-duration={1000}
                                    >
                                        <img
                                            src='assets/images/difference/fondation.jpg'
                                            alt='Image_inner'
                                            style={{ borderRadius: '20px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className='about mission-vision'>
                <div className='container'>
                    <div className='row g-4 align-items-start'>
                        <div className='col-12 col-lg-4'>
                            <div className='af-card' data-aos='fade-right' data-aos-duration={800}>
                                <h5 className='mb-3'>Mission</h5>
                                <p>
                                    To advance high-quality, open, and ethical research on
                                    Morocco and North Africa through the preservation and critical
                                    analysis of rare manuscripts and documentary collections,
                                    support for interdisciplinary scholarship, and the deployment
                                    of robust digital infrastructures that extend access and
                                    accelerate discovery.
                                </p>
                                <ul className='mt-3 af-list af-list-check'>
                                    <li> Digitize and preserve vulnerable materials at archival standards.</li>
                                    <li> Empower scholars via training, grants, and research residencies.</li>
                                    <li>Publish open-access datasets, editions, and tools for reuse.</li>
                                    <li>Integrate AI responsibly to enhance—not replace—humanistic inquiry.</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-12 col-lg-4'>
                            <div className='af-card' data-aos='fade-left' data-aos-duration={800}>
                                <h5 className='mb-3'>Vision</h5>
                                <p>
                                    A research ecosystem where traditional scholarship and digital
                                    innovation reinforce one another—making North African
                                    knowledge more findable, citable, and enduring for scholars,
                                    educators, and the public across languages and borders.
                                </p>
                                <ul className='mt-3 af-list af-list-check'>
                                    <li> Reliable access to primary sources through sustainable platforms.</li>
                                    <li> Stronger regional and international networks for co-authorship.</li>
                                    <li> Methodological excellence that blends philology and computation.</li>
                                    <li> Evidence-based policy insights rooted in historical analysis.</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-12 col-lg-4'>
                            <div className='af-card' data-aos='fade-left' data-aos-duration={800}>
                                <h5 className='mb-3'>Values</h5>
                                <p>
                                    A research ecosystem where traditional scholarship and digital
                                    innovation reinforce one another—making North African
                                    knowledge more findable, citable, and enduring for scholars,
                                    educators, and the public across languages and borders.
                                </p>
                                <ul className='mt-3 af-list af-list-check'>
                                    <li> Reliable access to primary sources through sustainable platforms.</li>
                                    <li> Stronger regional and international networks for co-authorship.</li>
                                    <li> Methodological excellence that blends philology and computation.</li>
                                    <li> Evidence-based policy insights rooted in historical analysis.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className='difference values'>
                <div className='container'>
                    <div className='row justify-content-center p-2'>
                        <div className='col-12 col-xl-10'>
                            <div className='section__header text-center' data-aos='fade-up'>
                                <h2 className='title-animation_inner'>Goals</h2>
                                <p>
                                    We operationalize our commitments through clear policies,
                                    transparent workflows, and measurable standards.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='row g-4'>
                        <div className='col-12 col-md-6 col-xl-4' data-aos='fade-up'>
                            <div className='af-card af-hover'>
                                <h5>Scholarly Rigor</h5>
                                <p>
                                    Peer review of editions and datasets; adherence to citation and
                                    provenance standards; method transparency in all publications.
                                </p>
                            </div>
                        </div>
                        <div className='col-12 col-md-6 col-xl-4' data-aos='fade-up' data-aos-delay='100'>
                            <div className='af-card af-hover'>
                                <h5>Preservation Stewardship</h5>
                                <p>
                                    Archival-grade digitization; fixity checks; redundant storage;
                                    lifecycle planning aligned with OAIS and FAIR principles.
                                </p>
                            </div>
                        </div>
                        <div className='col-12 col-md-6 col-xl-4' data-aos='fade-up' data-aos-delay='200'>
                            <div className='af-card af-hover'>
                                <h5>Open Access</h5>
                                <p>
                                    Non-exclusive rights; machine-readable licenses; public APIs;
                                    multilingual interfaces to broaden participation.
                                </p>
                            </div>
                        </div>
                        <div className='col-12 col-md-6 col-xl-4' data-aos='fade-up' data-aos-delay='300'>
                            <div className='af-card af-hover'>
                                <h5>Interdisciplinarity</h5>
                                <p>
                                    Co-designed projects with historians, sociologists, linguists,
                                    and data scientists; mixed-methods research protocols.
                                </p>
                            </div>
                        </div>
                        <div className='col-12 col-md-6 col-xl-4' data-aos='fade-up' data-aos-delay='400'>
                            <div className='af-card af-hover'>
                                <h5>Ethical Responsibility</h5>
                                <p>
                                    Culturally sensitive access models; community consultation;
                                    privacy-by-design for contemporary materials.
                                </p>
                            </div>
                        </div>
                        <div className='col-12 col-md-6 col-xl-4' data-aos='fade-up' data-aos-delay='500'>
                            <div className='af-card af-hover'>
                                <h5>Public Engagement</h5>
                                <p>
                                    Exhibitions, workshops, and teacher resources that translate
                                    research into inclusive learning.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* CounterOne */}
            <CounterOne />


            {/* Partner */}
            <Partner />


        </>
    );
};

export default AboutFoundation;


