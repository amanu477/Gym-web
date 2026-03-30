import React from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// BUTTON
// ----------------------------------------------------------------------
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-300 ease-out rounded-sm disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-[0.98]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]",
      ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
    };
    
    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

// ----------------------------------------------------------------------
// INPUT
// ----------------------------------------------------------------------
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-input border border-border rounded-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ----------------------------------------------------------------------
// CARD
// ----------------------------------------------------------------------
export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-card border border-border rounded-lg overflow-hidden", className)} {...props}>
    {children}
  </div>
);

// ----------------------------------------------------------------------
// SECTION HEADER
// ----------------------------------------------------------------------
export const SectionHeader = ({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) => (
  <div className={cn("text-center mb-12", className)}>
    {subtitle && <p className="text-primary font-display font-bold uppercase tracking-widest text-sm mb-2">{subtitle}</p>}
    <h2 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase">{title}</h2>
    <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
  </div>
);
