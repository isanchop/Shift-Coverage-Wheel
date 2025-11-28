import React from 'react';
import { ShiftThemeConfig, ShiftType } from './types';

// Adapted from user's MUI theme config to plain objects
export const SHIFT_THEME_CONFIG: Record<ShiftType, ShiftThemeConfig> = {
  morning: {
    gradient: {
      startLight: '#e8f5e9',
      endLight: '#4caf50',
      startDark: '#1b5e20',
      endDark: '#66bb6a',
    },
    icon: {
      light: '#4caf50',
      dark: '#66bb6a',
    },
  },
  afternoon: {
    gradient: {
      startLight: '#fff8e1',
      endLight: '#ffa726',
      startDark: '#424242',
      endDark: '#ffb74d',
    },
    icon: {
      light: '#ffa726',
      dark: '#ffb74d',
    },
  },
  night: {
    gradient: {
      startLight: '#e3f2fd',
      endLight: '#64b5f6',
      startDark: '#1a237e',
      endDark: '#90caf9',
    },
    icon: {
      light: '#64b5f6',
      dark: '#90caf9',
    },
  },
};

export const normalizeShiftCode = (code?: string | null): ShiftType => {
  const normalized = code ? code.toLowerCase() : 'morning';
  return (['morning', 'afternoon', 'night'].includes(normalized) ? normalized : 'morning') as ShiftType;
};

export const sanitizeGradientId = (...parts: string[]) =>
  parts
    .join('-')
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/--+/g, '-')
    .toLowerCase();
