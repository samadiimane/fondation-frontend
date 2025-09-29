"use client";
import { useState } from 'react';
import Link from 'next/link';

const LibrarySearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        documentType: '',
        yearRange: [1900, 2024],
        author: '',
        language: '',
        tags: [],
        hasFullText: false,
        peerReviewed: false
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [viewMode, setViewMode] = useState('detailed');


    const categories = [
        'Medieval Moroccan Studies',
        'Andalusian Cultural Heritage',
        'Colonial & Post-Colonial History',
        'Urban & Architectural Studies',
        'Religious & Sufi Traditions',
        'Economic & Commercial History',
        'Linguistic & Philological Studies',
        'Digital Humanities & Archives',
        'Manuscript Studies',
        'Archaeological Research'
    ];

    const documentTypes = [
        'Peer-Reviewed Article',
        'Monograph',
        'Historical Manuscript',
        'Conference Proceedings',
        'Research Thesis',
        'Archival Document',
        'Critical Edition',
        'Digital Collection',
        'Book Chapter',
        'Encyclopedia Entry'
    ];

    const languages = ['Arabic', 'French', 'English', 'Spanish', 'Berber', 'Classical Arabic', 'Latin', 'Portuguese'];

    const popularTags = [
        'Medieval Morocco', 'Al-Andalus', 'Sufi Studies', 'Urban History',
        'Colonial Architecture', 'Trade Networks', 'Manuscript Studies', 'Digital Preservation',
        'Islamic Art', 'Berber Culture', 'Moroccan Jews', 'Spanish Protectorate'
    ];


    const sampleDocuments = [
        {
            id: 1,
            title: "The Almoravid Dynasty and Trans-Saharan Trade: Economic Networks in Medieval Morocco (1040-1147)",
            author: "Dr. Abdelaziz Khallouk Temsamani",
            coAuthors: ["Prof. Hassan El-Mansouri", "Dr. Fatima Bennani"],
            year: 2003,
            type: "Monograph",
            category: "Economic & Commercial History",
            abstract: "This comprehensive study examines the economic foundations of Almoravid power, focusing on the dynasty's control of trans-Saharan trade routes and their impact on North African commercial networks. Through extensive archival research and archaeological evidence, the work demonstrates how the Almoravids transformed Morocco into a central hub of medieval Mediterranean-African commerce.",
            fullTextAvailable: true,
            citations: 247,
            doi: "10.1234/almoravid-trade-2003",
            isbn: "978-2-7449-0234-5",
            publisher: "Éditions de la Faculté des Lettres, Rabat",
            pages: 456,
            language: "French",
            keywords: ["Almoravids", "Trans-Saharan Trade", "Medieval Economics", "North Africa", "Commercial Networks"],
            peerReviewed: true,
            downloadCount: 3420,
            bookmarkCount: 89,
            fileSize: "12.4 MB",
            format: "PDF",
            openAccess: true
        },
        {
            id: 2,
            title: "Architectural Synthesis in Spanish Protectorate Morocco: Neo-Moorish Revival and Colonial Urbanism (1912-1956)",
            author: "Dr. Abdelaziz Khallouk Temsamani",
            coAuthors: ["Arch. María José González"],
            year: 1998,
            type: "Peer-Reviewed Article",
            category: "Urban & Architectural Studies",
            abstract: "This article analyzes the architectural transformation of northern Moroccan cities under Spanish colonial administration, examining how European planning principles were adapted to local contexts. The study reveals the complex negotiations between colonial modernization projects and traditional Maghrebi urban forms.",
            fullTextAvailable: true,
            citations: 156,
            doi: "10.1080/13467584.1998.12345678",
            journal: "Journal of North African Architecture",
            volume: "Vol. 23, No. 2",
            pages: "45-78",
            language: "English",
            keywords: ["Colonial Architecture", "Spanish Protectorate", "Urban Planning", "Neo-Moorish", "Tetouan"],
            peerReviewed: true,
            downloadCount: 2180,
            bookmarkCount: 67,
            fileSize: "8.7 MB",
            format: "PDF",
            openAccess: false
        },
        {
            id: 3,
            title: "Digital Archive of Rif Sufi Manuscripts: Preserving Spiritual Heritage Through Technology",
            author: "Dr. Abdelaziz Khallouk Temsamani",
            coAuthors: ["Dr. Ahmed Benali", "Prof. Aicha El-Idrissi"],
            year: 2010,
            type: "Digital Collection",
            category: "Religious & Sufi Traditions",
            abstract: "A groundbreaking digital preservation project documenting over 200 Sufi manuscripts from the Rif region (15th-20th centuries). This collection includes high-resolution digitizations, paleographic analysis, and searchable transcriptions of mystical texts, poetry, and spiritual commentaries.",
            fullTextAvailable: true,
            citations: 203,
            doi: "10.1234/rif-sufi-digital-2010",
            publisher: "Digital Humanities Research Center",
            itemCount: "247 manuscripts",
            totalPages: "12,450 pages digitized",
            language: "Classical Arabic",
            keywords: ["Digital Humanities", "Sufi Manuscripts", "Rif Region", "Paleography", "Islamic Mysticism"],
            peerReviewed: false,
            downloadCount: 5240,
            bookmarkCount: 134,
            fileSize: "2.1 GB",
            format: "Digital Archive",
            openAccess: true
        },
        {
            id: 4,
            title: "The Mellah of Tetouan: Jewish Community Life and Urban Space in Pre-Colonial Morocco",
            author: "Dr. Abdelaziz Khallouk Temsamani",
            coAuthors: ["Dr. Sarah Cohen", "Prof. Mohammed Kenbib"],
            year: 2006,
            type: "Book Chapter",
            category: "Urban & Architectural Studies",
            abstract: "This chapter examines the spatial organization and social dynamics of Tetouan's Jewish quarter, analyzing how communal identity was expressed through urban planning, architecture, and daily practices. The study draws on oral histories, architectural surveys, and archival documentation.",
            fullTextAvailable: true,
            citations: 98,
            doi: "10.1234/tetouan-mellah-2006",
            bookTitle: "Jewish Communities in the Islamic World: Historical and Contemporary Perspectives",
            editor: "Prof. Daniel Schroeter",
            publisher: "Sussex Academic Press",
            pages: "187-224",
            language: "English",
            keywords: ["Jewish Morocco", "Urban Studies", "Tetouan", "Mellah", "Cultural Heritage"],
            peerReviewed: true,
            downloadCount: 1560,
            bookmarkCount: 45,
            fileSize: "6.2 MB",
            format: "PDF",
            openAccess: false
        },
        {
            id: 5,
            title: "Manuscript Preservation Techniques in Moroccan Libraries: A Methodological Guide",
            author: "Dr. Abdelaziz Khallouk Temsamani",
            year: 2008,
            type: "Research Thesis",
            category: "Manuscript Studies",
            abstract: "A comprehensive methodology for the preservation, cataloging, and digitization of historical manuscripts in Moroccan institutions. This thesis establishes protocols for handling fragile documents while ensuring scholarly accessibility and long-term conservation.",
            fullTextAvailable: true,
            citations: 89,
            doi: "10.1234/manuscript-preservation-2008",
            university: "Mohammed V University",
            department: "Department of History and Archaeology",
            pages: 312,
            language: "Arabic",
            keywords: ["Manuscript Preservation", "Library Science", "Digital Preservation", "Conservation"],
            peerReviewed: true,
            downloadCount: 980,
            bookmarkCount: 28,
            fileSize: "15.3 MB",
            format: "PDF",
            openAccess: true
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchResults(sampleDocuments);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const toggleTag = (tag) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            documentType: '',
            yearRange: [1900, 2024],
            author: '',
            language: '',
            tags: [],
            hasFullText: false,
            peerReviewed: false
        });
        setSearchQuery('');
        setSearchResults([]);
    };

    const DocumentCard = ({ document, index }) => {
        const getFormatIcon = (format) => {
            switch (format?.toLowerCase()) {
                case 'pdf': return 'fa-solid fa-file-pdf';
                case 'digital archive': return 'fa-solid fa-database';
                case 'epub': return 'fa-solid fa-book';
                default: return 'fa-solid fa-file-text';
            }
        };

        const getAccessBadge = (openAccess) => {
            return openAccess
                ? { class: 'open-access', text: 'Open Access', icon: 'fa-solid fa-unlock' }
                : { class: 'restricted', text: 'Institutional Access', icon: 'fa-solid fa-lock' };
        };

        return (
            <div className="result-card">
                <div className="result-content">
                    <h3 className="result-title">{document.title}</h3>

                    <div className="result-authors">
                        <div className="primary-author">
                            <i className="fa-solid fa-user-graduate"></i>
                            <span>{document.author}</span>
                        </div>
                        {document.coAuthors && (
                            <div className="co-authors">
                                <span>with {document.coAuthors.join(', ')}</span>
                            </div>
                        )}
                    </div>

                    <div className="result-publication-info">
                        <div className="publication-details">
                            {document.journal && (
                                <div className="pub-detail">
                                    <i className="fa-solid fa-journal-whills"></i>
                                    <span>{document.journal} {document.volume}</span>
                                </div>
                            )}
                            {document.publisher && (
                                <div className="pub-detail">
                                    <i className="fa-solid fa-building"></i>
                                    <span>{document.publisher}</span>
                                </div>
                            )}
                            <div className="pub-detail">
                                <i className="fa-solid fa-calendar"></i>
                                <span>{document.year}</span>
                            </div>
                            {document.pages && (
                                <div className="pub-detail">
                                    <i className="fa-solid fa-file-lines"></i>
                                    <span>{typeof document.pages === 'number' ? `${document.pages} pages` : document.pages}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="result-abstract">{document.abstract}</p>

                    <div className="result-keywords">
                        {document.keywords.map((keyword, idx) => (
                            <span key={idx} className="keyword-tag">
                                <i className="fa-solid fa-tag"></i>
                                {keyword}
                            </span>
                        ))}
                    </div>

                    <div className="result-metrics">
                        <div className="metric-item">
                            <i className="fa-solid fa-quote-left"></i>
                            <span>{document.citations.toLocaleString()} citations</span>
                        </div>
                        <div className="metric-item">
                            <i className="fa-solid fa-download"></i>
                            <span>{document.downloadCount.toLocaleString()} downloads</span>
                        </div>
                        <div className="metric-item">
                            <i className="fa-solid fa-bookmark"></i>
                            <span>{document.bookmarkCount} bookmarks</span>
                        </div>
                        <div className="metric-item file-info">
                            <i className="fa-solid fa-hard-drive"></i>
                            <span>{document.fileSize}</span>
                        </div>
                    </div>

                    <div className="result-footer">
                        <div className="result-doi">
                            {document.doi && (
                                <>
                                    <span className="doi-label">DOI:</span>
                                    <Link href={`https://doi.org/${document.doi}`} className="doi-link" target="_blank">
                                        {document.doi}
                                    </Link>
                                </>
                            )}
                            {document.isbn && (
                                <>
                                    <span className="isbn-label">ISBN:</span>
                                    <span className="isbn-value">{document.isbn}</span>
                                </>
                            )}
                        </div>
                        <div className="result-actions-footer">
                            <button className="action-btn preview">
                                <i className="fa-solid fa-eye"></i>
                                Preview
                            </button>
                            {document.fullTextAvailable && (
                                <button className="action-btn download">
                                    <i className="fa-solid fa-download"></i>
                                    {document.openAccess ? 'Download Free' : 'Request Access'}
                                </button>
                            )}
                            <Link href={`/library/document/${document.id}`} className="action-btn view-details">
                                <i className="fa-solid fa-external-link-alt"></i>
                                Full Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="library-search">
            <div className="container">
                {/* header */}
                <div
                    className='section__header'
                    data-aos='fade-up'
                    data-aos-duration={900}
                >
                    <h2 className='title-animation_inner text-center'>
                        Digital <span> Research </span>  Collection
                    </h2>
                    <p className='mt-3 text-center'>
                        Explore over 15,000 peer-reviewed publications, rare manuscripts, and digital archives
                        spanning centuries of Moroccan and North African scholarly heritage
                    </p>
                </div>

                {/* Search Bar */}
                <div className="search-bar-container" data-aos="fade-up" data-aos-delay="200">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <div className="search-icon">
                                <i className="fa-solid fa-search"></i>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, author, keywords, DOI, or abstract content..."
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                <i className="fa-solid fa-search"></i>
                                Search Collection
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Filters */}
                <div className="quick-filters" data-aos="fade-up" data-aos-delay="400">
                    <div className="filters-container">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`filter-button ${showAdvanced ? 'active' : ''}`}
                        >
                            <i className={`fa-solid ${showAdvanced ? 'fa-filter-circle-xmark' : 'fa-sliders-h'}`}></i>
                            {showAdvanced ? 'Hide Advanced Search' : 'Advanced Search Options'}
                        </button>

                        <select
                            value={filters.documentType}
                            onChange={(e) => handleFilterChange('documentType', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Document Types</option>
                            {documentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Research Domains</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <button
                            onClick={clearFilters}
                            className="filter-clear"
                        >
                            <i className="fa-solid fa-undo-alt"></i>
                            Reset All Filters
                        </button>
                    </div>
                </div>

                {/*  Advanced Filters */}
                {showAdvanced && (
                    <div className="advanced-filters">
                        <div className="filters-card">
                            <div className="filters-grid">
                                <div className="filter-group">
                                    <label className="filter-label">
                                        Publication Timeline
                                    </label>
                                    <div className="year-range">
                                        <input
                                            type="number"
                                            placeholder="From year"
                                            className="year-input"
                                            value={filters.yearRange[0]}
                                            onChange={(e) => handleFilterChange('yearRange', [parseInt(e.target.value), filters.yearRange[1]])}
                                        />
                                        <span className="year-separator">to</span>
                                        <input
                                            type="number"
                                            placeholder="To year"
                                            className="year-input"
                                            value={filters.yearRange[1]}
                                            onChange={(e) => handleFilterChange('yearRange', [filters.yearRange[0], parseInt(e.target.value)])}
                                        />
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">
                                        Publication Language
                                    </label>
                                    <select
                                        value={filters.language}
                                        onChange={(e) => handleFilterChange('language', e.target.value)}
                                        className="filter-input"
                                    >
                                        <option value="">All Languages Available</option>
                                        {languages.map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">
                                        Author or Contributor
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search by author, editor, or contributor name..."
                                        value={filters.author}
                                        onChange={(e) => handleFilterChange('author', e.target.value)}
                                        className="filter-input"
                                    />
                                </div>
                            </div>

                            <div className="tags-section">
                                <label className="filter-label">
                                    Subject Areas & Research Keywords
                                </label>
                                <div className="tags-container">
                                    {popularTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`tag-button ${filters.tags.includes(tag) ? 'active' : ''}`}
                                        >
                                            <i className="fa-solid fa-tag"></i>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                <div className="search-results">
                    <div className="results-header">
                        <div className="results-info">
                            <h3 className="results-title">
                                <i className="fa-solid fa-list-check"></i>
                                Research Results
                            </h3>
                            <p className="results-count">
                                Found {searchResults.length} scholarly resources matching your criteria
                            </p>
                        </div>
                        <div className="results-controls">
                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
                                    onClick={() => setViewMode('detailed')}
                                >
                                    <i className="fa-solid fa-list"></i>
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                                    onClick={() => setViewMode('compact')}
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                            </div>
                            <select className="sort-select">
                                <option value="relevance">Sort by Relevance</option>
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="citations">Most Cited</option>
                                <option value="author">Author A-Z</option>
                            </select>
                        </div>
                    </div>

                    <div className={`results-grid ${viewMode}`}>
                        {searchResults.map((result, index) => (
                            <DocumentCard key={result.id} document={result} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LibrarySearch;