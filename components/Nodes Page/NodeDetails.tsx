import React, { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';
import { socket } from '@/app/socket';

type Status = 'Maintenance' | 'Free' | 'Occupied' | 'Disconnected' | 'Paused';

interface NodeDetailsProps {
  name: string;
  occupied: string;
  status: Status;
  clicked: boolean;
  nodeId: String;
}

const NodeDetails = ({
  name,
  occupied: initialOccupied,
  status: initialStatus,
  clicked,
  nodeId,
}: NodeDetailsProps) => {
  interface PrinterStatus {
    name: string;
    status: Status;
  }

  const defaultStatus: PrinterStatus = {
    name: 'None',
    status: 'Free',
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    // Enforce type safety
    const handleStatusUpdate = (payload: any | any[]) => {
      const printerStatusUpdatesArray = Array.isArray(payload) ? payload : [payload];
      const printerStatus = printerStatusUpdatesArray.find((s) => s._id === nodeId);

      if (!printerStatus) return;
      queryClient.setQueryData<PrinterStatus | any>(
        ['nodeUserStatus', nodeId],
        (prev: PrinterStatus) => ({
          name: printerStatus?.name ?? prev?.name ?? defaultStatus.name,
          status: printerStatus?.status ?? prev?.status ?? defaultStatus.status,
        })
      );
    };

    socket.on('printerStatus', handleStatusUpdate);

    return () => {
      socket.off('printerStatus', handleStatusUpdate);
    };
  }, [nodeId, queryClient, defaultStatus.name, defaultStatus.status]);

  const getStatusColor = (currentStatus: Status | undefined) => {
    switch (currentStatus) {
      case 'Free':
        return 'bg-green-500';
      case 'Occupied':
        return 'bg-red-500';
      case 'Maintenance':
        return 'bg-orange-400';
      case 'Paused':
        return 'bg-orange-400';
      default:
        return 'bg-green-500';
    }
  };

  const { data } = useQuery<PrinterStatus>(
    ['nodeUserStatus', nodeId],
    () =>
      (queryClient.getQueryData(['nodeUserStatus', nodeId]) as PrinterStatus) ??
      defaultStatus,
    {
      initialData: defaultStatus,
      staleTime: Infinity,
    }
  );

  return (
    <div className={`w-full ${!clicked && 'border-b-2 border-gray-200'}`}>
      <div className="flex cursor-pointer items-center px-6 py-4">
        <div className="mr-6 shrink-0">
          <div className={`size-6 rounded-full ${getStatusColor(data?.status)}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">Name</h4>
          <p className="text-sm text-gray-400">{name}</p>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">Current User</h4>
          <p className="text-sm text-gray-400">{data?.name ?? 'None'}</p>
        </div>
        {/*
        <div className="flex-1">
          <StatusDropdown status={data.status} index={1} />
        </div>
      
       */}
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

/*  

###
CAN BE USED WHEN WANTING TO CHANGE FROM FREE TO TAKEN OR FOR IT TO BE ON MAINTENANCE ETC...
###


*/

// const StatusDropdown = ({ status, index = 0 }: StatusDropdownProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selected, setSelected] = useState<Status>(status);
//   const statuses: Status[] = ['Open', 'Busy', 'Maintenance'];

//   React.useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (isOpen && !(event.target as Element).closest(`[data-dropdown-id="${index}"]`)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, index]);

//   const handleStatusChange = (newStatus: Status) => {
//     setSelected(newStatus);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative w-full" data-dropdown-id={index}>
//       <div className="relative">
//         <div className="absolute -top-2 left-2 z-[1] bg-white px-1 text-xs text-gray-700">
//           Status *
//         </div>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsOpen(!isOpen);
//           }}
//           className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-left hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <span className="text-gray-900">{selected}</span>
//           <ChevronDown
//             size={16}
//             className={`text-gray-500 transition-transform duration-200 ${
//               isOpen ? 'rotate-180' : ''
//             }`}
//           />
//         </button>
//       </div>
//       {isOpen && (
//         <div
//           className="absolute z-[100] mt-1 w-full rounded border border-gray-300 bg-white shadow-lg"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {statuses.map((status) => (
//             <div
//               key={status}
//               className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
//                 selected === status ? 'bg-gray-50' : ''
//               }`}
//               onClick={() => handleStatusChange(status)}
//             >
//               {status}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
