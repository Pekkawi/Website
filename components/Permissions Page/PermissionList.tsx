'use client';

import { useQuery } from 'react-query';
import PageLoader from '@/components/shared/PageLoader';
import { IPerm } from '@/interfaces/database.interfaces';
import { Types } from 'mongoose';

async function getPermissions() {
  try {
    const res = await fetch('/api/permissions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return undefined;
    }
    const permissions = await res.json();
    return permissions;
  } catch (err) {
    return undefined;
  }
}

async function updatePermission(id: Types.ObjectId) {
  try {
    const res = await fetch(`/api/permissions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to update permission');
    }
    return await res.json();
  } catch (err) {
    return undefined;
  }
}

const PermissionList = () => {};

export default PermissionList;
