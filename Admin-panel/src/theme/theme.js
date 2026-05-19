import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', contrastText: '#fff' },
    secondary: { main: '#8b5cf6' },
    success:   { main: '#10b981', light: '#d1fae5', dark: '#065f46' },
    warning:   { main: '#f59e0b', light: '#fef3c7', dark: '#92400e' },
    error:     { main: '#ef4444', light: '#fee2e2', dark: '#991b1b' },
    info:      { main: '#3b82f6', light: '#dbeafe', dark: '#1e40af' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: { fontWeight: 700, fontSize: '1.5rem' },
    h5: { fontWeight: 700, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem', color: '#64748b' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 1px 3px rgba(0,0,0,0.1)',
    '0 4px 6px rgba(0,0,0,0.07)',
    '0 10px 15px rgba(0,0,0,0.07)',
    '0 20px 25px rgba(0,0,0,0.07)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
    MuiTextField: {
      styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#94a3b8',
            borderBottom: '1px solid #e2e8f0',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottom: '1px solid #f1f5f9', padding: '12px 16px' } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0f172a',
          color: '#e2e8f0',
          borderRight: 'none',
          width: 240,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
            color: '#818cf8',
            '& .MuiListItemIcon-root': { color: '#818cf8' },
          },
          '&:hover': { background: 'rgba(255,255,255,0.05)' },
        },
      },
    },
  },
});

export default theme;
