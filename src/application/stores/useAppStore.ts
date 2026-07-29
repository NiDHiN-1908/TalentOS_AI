import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'RECRUITER' | 'EMPLOYEE' | 'EXECUTIVE';

interface AppState {
  sidebarOpen: boolean;
  themeMode: 'dark' | 'light';
  activeTenantId: string;
  userRole: UserRole;
  aiCopilotOpen: boolean;
  activeView: string;

  toggleSidebar: () => void;
  toggleTheme: () => void;
  setTenantId: (id: string) => void;
  setUserRole: (role: UserRole) => void;
  toggleAICopilot: () => void;
  setActiveView: (view: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  themeMode: 'dark',
  activeTenantId: 'TNT-TALENTOS-01',
  userRole: 'EXECUTIVE',
  aiCopilotOpen: false,
  activeView: 'dashboard',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
  setTenantId: (id) => set({ activeTenantId: id }),
  setUserRole: (role) => set({ userRole: role }),
  toggleAICopilot: () => set((state) => ({ aiCopilotOpen: !state.aiCopilotOpen })),
  setActiveView: (view) => set({ activeView: view }),
}));
