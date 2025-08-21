"use client";
import * as React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const cache = createCache({ key: 'css', prepend: true });
const theme = createTheme();

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
