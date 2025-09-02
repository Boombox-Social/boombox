// types/ui.types.ts
import React from 'react';
import { Client } from './client.types';
import { NewClientForm } from './form.types';

export interface SidePanelProps {
  collapsed: boolean;
  onCollapse: () => void;
  clients: Client[];
  onAddClientClick: () => void;
  isLoading?: boolean; // Add this
  error?: string; // Add this
}

export interface ClientItemProps {
  client: Client;
  isSelected: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export interface ActionButtonProps {
  onClick: () => void;
  variant: 'primary' | 'secondary';
  collapsed: boolean;
  icon: React.ReactNode;
  text: string;
}

export interface FormFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  style?: React.CSSProperties;
  multiline?: boolean;
}

export interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: NewClientForm) => void;
}

export type ButtonVariant = 'primary' | 'secondary';

export interface ColorTheme {
  bg: string;
  side: string;
  card: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
  hover: string;
}