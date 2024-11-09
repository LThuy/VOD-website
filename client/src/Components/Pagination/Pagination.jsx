import React from 'react';
import '../../Style/BodyCss/Pagination.css'; 

function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const maxButtons = 5;
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, currentPage + half);

        if (end - start + 1 < maxButtons) {
            if (currentPage <= half) {
                end = Math.min(totalPages, maxButtons);
            } else {
                start = Math.max(1, totalPages - maxButtons + 1);
            }
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const handlePageChange = (page) => {
        if (page !== currentPage) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Pre
            </button>
            {getPageNumbers().map(page => (
                <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}
            {currentPage < totalPages - 3 && (
                <>
                    <span className="pagination-dots">...</span>
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            )}
            <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
