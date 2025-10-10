"use client";
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { getDocuments } from '@/lib/api';
import Pagination from './Pagination';
import Skeleton from './Skeleton';

const PAGE_SIZE = 20;

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [lastQuery, setLastQuery] = useState('');
    const [hasNext, setHasNext] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);


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


    const fetchDocuments = async (query, targetPage = 1) => {
        const trimmedQuery = query?.trim() ?? '';
        setIsLoading(true);
        setError(null);

        try {
            const { documents, hasNext: nextPageAvailable, page: currentPage } = await getDocuments({
                q: trimmedQuery || undefined,
                page: targetPage,
                pageSize: PAGE_SIZE,
            });

            setSearchResults(documents);
            setHasNext(nextPageAvailable);
            setPage(currentPage || targetPage);
            setLastQuery(trimmedQuery);
            setHasSearched(true);
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: targetPage > 1 ? 'smooth' : 'auto' });
            }
        } catch (err) {
            console.error(err);
            const message = err?.message || 'Unable to load documents. Please try again soon.';
            const friendlyMessage = message.includes('Missing NEXT_PUBLIC_API_BASE')
                ? 'NEXT_PUBLIC_API_BASE is not configured. Add it to .env.local to enable document search.'
                : message;
            setError(friendlyMessage);
            setSearchResults([]);
            setHasNext(false);
            setHasSearched(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDocuments(searchQuery, 1);
    };

    const handlePageChange = (nextPage) => {
        if (isLoading || nextPage === page) {
            return;
        }

        const query = lastQuery || searchQuery;
        fetchDocuments(query, nextPage);
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
        setPage(1);
        setLastQuery('');
        setHasNext(false);
        setError(null);
        setHasSearched(false);
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

        const formatIcon = getFormatIcon(document.format ?? document.type);
        const typeClass = document.type ? document.type.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
        const accessBadge = getAccessBadge(document.openAccess ?? document.fullTextAvailable);
        const keywordList = Array.isArray(document.keywords) ? document.keywords : [];
        const citations = typeof document.citations === 'number' ? document.citations : null;
        const downloads = typeof document.downloadCount === 'number' ? document.downloadCount : null;
        const bookmarks = typeof document.bookmarkCount === 'number' ? document.bookmarkCount : null;
        const hasMetrics = citations !== null || downloads !== null || bookmarks !== null || Boolean(document.fileSize);
        const downloadLabel = document.openAccess === false ? 'Request Access' : 'Open PDF';

        return (
            <div className="result-card">
                <div className="result-content">
                    <h3 className="result-title">{document.title}</h3>
                    <div className="result-badges">
                        {document.type && (
                            <span className={`type-badge ${typeClass}`}>
                                <i className={formatIcon}></i>
                                {document.type}
                            </span>
                        )}
                        <span className={`access-badge ${accessBadge.class}`}>
                            <i className={accessBadge.icon}></i>
                            {accessBadge.text}
                        </span>
                    </div>
                    <div className="result-authors">
                        <div className="primary-author">
                            <i className="fa-solid fa-user-graduate"></i>
                            <span>{document.author || 'Unknown author'}</span>
                        </div>
                        {Array.isArray(document.coAuthors) && document.coAuthors.length > 0 && (
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
                            {(document.year || document.year === 0) && (
                                <div className="pub-detail">
                                    <i className="fa-solid fa-calendar"></i>
                                    <span>{document.year}</span>
                                </div>
                            )}
                            {document.pages && (
                                <div className="pub-detail">
                                    <i className="fa-solid fa-file-lines"></i>
                                    <span>{typeof document.pages === 'number' ? `${document.pages} pages` : document.pages}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="result-abstract">{document.abstract}</p>

                    {keywordList.length > 0 && (
                        <div className="result-keywords">
                            {keywordList.map((keyword, idx) => (
                                <span key={idx} className="keyword-tag">
                                    <i className="fa-solid fa-tag"></i>
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    )}

                    {hasMetrics && (
                        <div className="result-metrics">
                            {citations !== null && (
                                <div className="metric-item">
                                    <i className="fa-solid fa-quote-left"></i>
                                    <span>{citations.toLocaleString()} citations</span>
                                </div>
                            )}
                            {downloads !== null && (
                                <div className="metric-item">
                                    <i className="fa-solid fa-download"></i>
                                    <span>{downloads.toLocaleString()} downloads</span>
                                </div>
                            )}
                            {bookmarks !== null && (
                                <div className="metric-item">
                                    <i className="fa-solid fa-bookmark"></i>
                                    <span>{bookmarks} bookmarks</span>
                                </div>
                            )}
                            {document.fileSize && (
                                <div className="metric-item file-info">
                                    <i className="fa-solid fa-hard-drive"></i>
                                    <span>{document.fileSize}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="result-footer">
                        <div className="result-doi">
                            {document.doi && (
                                <>
                                    <span className="doi-label">DOI:</span>
                                    <a
                                        href={`https://doi.org/${document.doi}`}
                                        className="doi-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {document.doi}
                                    </a>
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
                            <button className="action-btn preview" type="button">
                                <i className="fa-solid fa-eye"></i>
                                Preview
                            </button>
                            {document.fullTextAvailable && (
                                <button className="action-btn download" type="button">
                                    <i className="fa-solid fa-download"></i>
                                    {downloadLabel}
                                </button>
                            )}
                            <Link
                                href={`/documents/${document.id}`}
                                className="action-btn view-details"
                                aria-label={`View details for ${document.title}`}
                            >
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

                <div
                    className="library-shortcuts"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        margin: '2rem 0'
                    }}
                >
                    <Link
                        href='/documents'
                        className='search-button'
                        style={{
                            padding: '0.65rem 1.75rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <i className='fa-solid fa-book-open'></i> Browse Documents
                    </Link>
                    <Link
                        href='/collections'
                        className='filter-button'
                        style={{
                            padding: '0.65rem 1.75rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <i className='fa-solid fa-layer-group'></i> View Collections
                    </Link>
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
                                {isLoading && !hasSearched && 'Searching the collection...'}
                                {!isLoading && !hasSearched && 'Start exploring the collection by running a search.'}
                                {isLoading && hasSearched && 'Refreshing results...'}
                                {!isLoading && hasSearched && searchResults.length > 0 && (
                                    <>Found {searchResults.length} scholarly resources matching your criteria</>
                                )}
                                {!isLoading && hasSearched && searchResults.length === 0 && 'No documents found for this search.'}
                            </p>
                            {isLoading && (
                                <span className="results-loading-indicator" aria-hidden="true">
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                </span>
                            )}
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
                        {isLoading && searchResults.length === 0 && (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={`skeleton-${idx}`}
                                    className="result-card skeleton-card"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                                >
                                    <Skeleton style={{ width: '60%', height: '1.1rem' }} />
                                    <Skeleton style={{ width: '40%', height: '0.9rem' }} />
                                    <Skeleton style={{ width: '100%', height: '0.9rem' }} />
                                    <Skeleton style={{ width: '85%', height: '0.9rem' }} />
                                </div>
                            ))
                        )}
                        {!isLoading && searchResults.length > 0 && (
                            searchResults.map((result, index) => (
                                <DocumentCard key={result.id} document={result} index={index} />
                            ))
                        )}
                        {!isLoading && hasSearched && searchResults.length === 0 && !error && (
                            <div className="result-card empty-result">
                                <div className="result-content">
                                    <i className="fa-solid fa-magnifying-glass mb-3"></i>
                                    <h4 className="result-title">No documents found</h4>
                                    <p>Try adjusting your keywords or filters to discover more resources.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {error && (
                        <div
                            className="results-error"
                            role="alert"
                            style={{
                                marginTop: '1.5rem',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                background: 'rgba(254, 226, 226, 0.6)',
                                color: '#991b1b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                        >
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <span>{error}</span>
                        </div>
                    )}
                    {(hasNext || page > 1) && (
                        <Pagination page={page} hasNext={hasNext} onPageChange={handlePageChange} isLoading={isLoading} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default LibrarySearch;
