// src/components/ui/Pagination.tsx
'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    // Basic pagination logic (can be made more complex with '...')
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    return pages;
  };
  
  return (
    <div className="mt-12 flex justify-center items-center space-x-2">
      {getPageNumbers().map(pageNumber => (
        <button 
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-4 py-2 text-sm font-semibold rounded-md shadow-sm transition-colors ${
            currentPage === pageNumber 
            ? 'text-white bg-primary-blue' 
            : 'text-dark-gray bg-white border border-light-gray hover:bg-gray-50'
          }`}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

export default Pagination;