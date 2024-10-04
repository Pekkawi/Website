import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 1; // Reduced to show fewer pages
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <nav className="flex items-center justify-center space-x-1 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex size-8 items-center justify-center rounded-md text-gray-500 transition-colors duration-200 hover:text-orange-500 disabled:text-gray-300"
      >
        <ChevronLeft className="size-5" />
      </button>
      {getPageNumbers().map((number, index) => (
        <button
          key={index}
          onClick={() => typeof number === 'number' && onPageChange(number)}
          disabled={typeof number !== 'number'}
          className={`flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors duration-200 ${
            currentPage === number
              ? 'bg-orange-500 text-white'
              : typeof number === 'number'
              ? 'text-gray-500 hover:bg-orange-100'
              : 'text-gray-300'
          }`}
        >
          {typeof number === 'number' ? number : '•••'}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex size-8 items-center justify-center rounded-md text-gray-500 transition-colors duration-200 hover:text-orange-500 disabled:text-gray-300"
      >
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
};

export default UserPagination;