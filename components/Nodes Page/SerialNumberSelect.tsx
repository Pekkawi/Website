import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SerialNumberSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const raspberryPiSerials = [
    { id: '1000000063421f91', desc: 'Raspberry Pi 4 Model B - 8GB' },
    { id: '10000000a3b2cf82', desc: 'Raspberry Pi 4 Model B - 4GB' },
    { id: '100000002c45da73', desc: 'Raspberry Pi 4 Model B - 4GB' },
    { id: '10000000f5d31b64', desc: 'Raspberry Pi 4 Model B - 2GB' },
    { id: '1000000047e92a55', desc: 'Raspberry Pi 4 Model B - 2GB' },
    { id: '100000008bf61c46', desc: 'Raspberry Pi 3 Model B+' },
    { id: '10000000d9a74d37', desc: 'Raspberry Pi 3 Model B+' },
    { id: '10000000ec183e28', desc: 'Raspberry Pi 3 Model B' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (isOpen && !event.target.closest('[data-select]')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative w-full" data-select>
      <div className="relative">
        <div className="absolute -top-2 left-2 z-[1] bg-white px-1 text-xs text-gray-700 dark:bg-dark-300 dark:text-gray-400">
          Select Raspberry Pi
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="background-light900_dark300 flex w-full items-center justify-between rounded border border-gray-300 px-3 py-2 text-left hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <span className="text-dark100_light900">
            {selected ? selected.id : 'Select Serial Number'}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-[100] mt-1 max-h-[180px] w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-dark-300">
          {raspberryPiSerials.map((pi) => (
            <div
              key={pi.id}
              className={`cursor-pointer px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700
                ${selected?.id === pi.id ? 'bg-gray-50 dark:bg-gray-800' : ''}
              `}
              onClick={() => {
                setSelected(pi);
                setIsOpen(false);
              }}
            >
              <p className="text-dark100_light900 font-medium">{pi.desc}</p>
              <p className="text-sm text-gray-500">SN: {pi.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SerialNumberSelect;
