import { ReactNode } from 'react';

interface AnimatedGradientProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedGradient = ({ children, className = '' }: AnimatedGradientProps) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
      {children}
    </div>
  );
};