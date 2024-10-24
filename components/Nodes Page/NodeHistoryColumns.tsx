'use client';

import { ColumnDef } from '@tanstack/react-table';

// Interface
export type History = {
  name: string;
  email: string;
  date: Date;
};

export const columns: ColumnDef<History>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date: Date = row.original.date;
      const year = date.getFullYear();
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' }); // Month name
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} ${hours}:${minutes} ${year}`;
    },
  },
];
