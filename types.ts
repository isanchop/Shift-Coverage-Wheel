import React from 'react';

export interface ShiftUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface ShiftThemeConfig {
  gradient: {
    startLight: string;
    endLight: string;
    startDark: string;
    endDark: string;
  };
  icon: {
    light: string;
    dark: string;
  };
}

export interface ShiftConfigItem {
  code: ShiftType;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}