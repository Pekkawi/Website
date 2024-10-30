'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getPermissions } from '@/hooks/permissionHooks';
import { useQuery } from 'react-query';
import { IPerm } from '@/interfaces/database.interfaces';

const PermissionsTypeSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<IPerm | null>(null);

  const { data: perms } = useQuery('permissions', getPermissions, {
    staleTime: Infinity,
  });

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
          Machine Type
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="background-light900_dark300 flex w-full items-center justify-between rounded border border-gray-300 px-3 py-2 text-left hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <span className="text-dark100_light900">
            {selected ? `${selected.abbreviation} ` : 'Select Machine Type'}
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
          {perms.map((perm: IPerm) => (
            <div
              key={perm.name}
              className={`cursor-pointer px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700
                ${selected?.name === perm.name ? 'bg-gray-50 dark:bg-gray-800' : ''}
              `}
              onClick={() => {
                setSelected(perm);
                setIsOpen(false);
              }}
            >
              <p className="text-dark100_light900 font-medium">
                {perm.abbreviation} {perm.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionsTypeSelect;
