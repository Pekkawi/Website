import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Status = 'Maintenance' | 'Open' | 'Busy';

interface StatusDropdownProps {
  status: Status;
  index?: number;
  onStatusChange?: (newStatus: Status) => void;
}

interface NodeDetailsProps {
  name: string;
  occupied: string;
  status: Status;
  clicked: boolean;
}

const StatusDropdown = ({ status, index = 0, onStatusChange }: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Status>(status);
  const statuses: Status[] = ['Open', 'Busy', 'Maintenance'];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest(`[data-dropdown-id="${index}"]`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, index]);

  const handleStatusChange = (newStatus: Status) => {
    setSelected(newStatus);
    setIsOpen(false);
    onStatusChange?.(newStatus);
  };

  return (
    <div className="relative w-full" data-dropdown-id={index}>
      <div className="relative">
        <div className="absolute -top-2 left-2 z-[1] bg-white px-1 text-xs text-gray-700">
          Status *
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
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
      {isOpen && (
        <div
          className="absolute z-[100] mt-1 w-full rounded border border-gray-300 bg-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {statuses.map((status) => (
            <div
              key={status}
              className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                selected === status ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NodeDetails = ({
  name,
  occupied: initialOccupied,
  status: initialStatus,
  clicked,
}: NodeDetailsProps) => {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [occupied, setOccupied] = useState<string>(initialOccupied);

  const getStatusColor = (currentStatus: Status) => {
    switch (currentStatus) {
      case 'Open':
        return 'bg-green-500';
      case 'Busy':
        return 'bg-red-500';
      case 'Maintenance':
        return 'bg-orange-400';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStatusChange = (newStatus: Status) => {
    // If changing from Locked to Ready or Maintenance, clear the occupier
    if (status === 'Busy' && (newStatus === 'Open' || newStatus === 'Maintenance')) {
      setOccupied('None');
    }
    setStatus(newStatus);
  };

  return (
    <div className={`w-full ${!clicked && 'border-b-2 border-gray-200'}`}>
      <div className="flex cursor-pointer items-center px-6 py-4">
        <div className="mr-6 shrink-0">
          <div className={`size-6 rounded-full ${getStatusColor(status)}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">Name</h4>
          <p className="text-sm text-gray-400">{name}</p>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">Current User</h4>
          <p className="text-sm text-gray-400">{occupied}</p>
        </div>
        <div className="flex-1">
          <StatusDropdown status={status} index={1} onStatusChange={handleStatusChange} />
        </div>
        <span className={`ml-4 shrink-0 text-gray-400`}>
          <ChevronDown
            className={`size-6 transition-transform duration-200 ${clicked ? 'rotate-180' : ''}`}
          />
        </span>
      </div>
    </div>
  );
};

export default NodeDetails;
