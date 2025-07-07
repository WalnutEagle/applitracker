
export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export interface HistoryEntry {
  date: string; // YYYY-MM-DD format
  count: number;
  goal: number;
}

export type Theme = 'default' | 'sunset' | 'graphite';