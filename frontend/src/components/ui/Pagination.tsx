// frontend/src/components/ui/Pagination.tsx

import React from 'react';

// Define the props the component will accept
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  
  // This function generates the array of page numbers and ellipses to display
  const generatePageNumbers = () => {
    const pageNumbers = [];
    // The total number of page links to show at once
    const pageLinkLimit = 7; 

    // Case 1: If total pages are 7 or less, show all page numbers
    if (totalPages <= pageLinkLimit) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // Case 2: If total pages are more than 7
    // Show first page, ellipses, current page +/- 1, ellipses, last page
    const leftSibling = currentPage - 1;
    const rightSibling = currentPage + 1;
    
    let showLeftEllipsis = false;
    let showRightEllipsis = false;

    // Show first page
    pageNumbers.push(1);

    // Logic for left ellipsis
    if (currentPage > 3) {
      showLeftEllipsis = true;
      pageNumbers.push('...');
    }
    
    // Pages around the current page
    for(let i = leftSibling; i <= rightSibling; i++){
        if(i > 1 && i < totalPages){
            pageNumbers.push(i);
        }
    }
    
    // Logic for right ellipsis
    if (currentPage < totalPages - 2) {
      showRightEllipsis = true;
      pageNumbers.push('...');
    }
    
    // Show last page
    pageNumbers.push(totalPages);

    // A cleanup step to remove duplicates if the logic overlaps (e.g. current page is 2)
    return [...new Set(pageNumbers)];
  };

  const pagesToRender = generatePageNumbers();
  
  // Don't render anything if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination">
      <ul className="inline-flex items-center -space-x-px">
        {pagesToRender.map((page, index) => {
          if (typeof page === 'string') {
            // Render the ellipsis as a non-interactive element
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-4 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                  ...
                </span>
              </li>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`
                  px-4 py-2 leading-tight border transition-colors
                  ${
                    isCurrent
                      ? 'bg-primary-blue text-white border-primary-blue z-10'
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                  }
                `}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;