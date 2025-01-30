export const themes = [
  { value: 'light', label: 'Light', icon: '/assets/icons/sun.svg' },
  { value: 'dark', label: 'Dark', icon: '/assets/icons/moon.svg' },
];

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export const sidebarLinks: SidebarLink[] = [
  {
    route: '/',
    label: 'Home',
    imgURL: '/assets/icons/home.svg',
  },
  {
    route: '/nodes',
    label: 'Machines',
    imgURL: '/assets/icons/nodes.svg',
  },
  {
    route: '/users',
    label: 'Users',
    imgURL: '/assets/icons/users.svg',
  },
  {
    route: '/permissions',
    label: 'Permissions',
    imgURL: '/assets/icons/permissions.svg',
  },
  {
    route: '/test_ws',
    label: 'WebSocket Connect',
    imgURL:'/assets/icons/socket.svg'
  }
];
