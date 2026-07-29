import { useAppStore } from '../src/application/stores/useAppStore';

describe('Enterprise Frontend Experience Platform Store', () => {
  beforeEach(() => {
    useAppStore.setState({
      sidebarOpen: true,
      themeMode: 'dark',
      userRole: 'EXECUTIVE',
      aiCopilotOpen: false,
      activeView: 'dashboard'
    });
  });

  test('should toggle sidebar open and closed state', () => {
    expect(useAppStore.getState().sidebarOpen).toBe(true);
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(false);
  });

  test('should toggle theme mode between dark and light', () => {
    expect(useAppStore.getState().themeMode).toBe('dark');
    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().themeMode).toBe('light');
  });

  test('should toggle AI Copilot drawer open state', () => {
    expect(useAppStore.getState().aiCopilotOpen).toBe(false);
    useAppStore.getState().toggleAICopilot();
    expect(useAppStore.getState().aiCopilotOpen).toBe(true);
  });

  test('should update active view navigation state', () => {
    useAppStore.getState().setActiveView('grc');
    expect(useAppStore.getState().activeView).toBe('grc');
  });
});
