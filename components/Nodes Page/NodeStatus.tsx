import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const StatusDropdown = ({ index = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Ready');
  const statuses = ['Ready', 'Locked', 'Maintenance'];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(`[data-dropdown-id="${index}"]`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, index]);

  return (
    <div className="relative w-full" data-dropdown-id={index}>
      {/* Wrapper for label and input */}
      <div className="relative">
        {/* Label positioned to blend with border */}
        <div className="absolute -top-2 left-2 z-[1] bg-white px-1 text-xs text-gray-700">
          Status *
        </div>

        {/* Dropdown button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click event
            setIsOpen(!isOpen);
          }}
          className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-left hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-gray-900">{selected}</span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-[100] mt-1 w-full rounded border border-gray-300 bg-white shadow-lg"
          onClick={(e) => e.stopPropagation()} // Prevent row click event
        >
          {statuses.map((status) => (
            <div
              key={status}
              className={`
                cursor-pointer px-3 py-2 hover:bg-gray-100
                ${selected === status ? 'bg-gray-50' : ''}
              `}
              onClick={() => {
                setSelected(status);
                setIsOpen(false);
              }}
            >
              {status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
