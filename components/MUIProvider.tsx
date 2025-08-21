"use client";
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

export default function MUIProvider({ children }: { children: React.ReactNode }) {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
