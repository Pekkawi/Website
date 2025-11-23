export const themes = [
  { value: 'light', label: 'Light', icon: '/assets/icons/sun.svg' },
  { value: 'dark', label: 'Dark', icon: '/assets/icons/moon.svg' },
];

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
  allowedRoles: string[];
}

export const sidebarLinks: SidebarLink[] = [
  {
    route: '/',
    label: 'Home',
    imgURL: '/assets/icons/home.svg',
    allowedRoles: ['User', 'Admin'],
  },
  {
    route: '/nodes',
    label: 'Nodes',
    imgURL: '/assets/icons/nodes.svg',
    allowedRoles: ['Admin'],
  },
  {
    route: '/users',
    label: 'Users',
    imgURL: '/assets/icons/users.svg',
    allowedRoles: ['Admin'],
  },
  {
    route: '/permissions',
    label: 'Permissions',
    imgURL: '/assets/icons/permissions.svg',
    allowedRoles: ['Admin'],
  },
  {
    route: '/profile',
    label: 'Profile',
    imgURL: '/assets/icons/profile.svg',
    allowedRoles: ['User', 'Admin'],
  },
];
