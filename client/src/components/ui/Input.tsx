import React, { type InputHTMLAttributes } from 'react';
import { cn } from './Button'; // Reusing cn utility

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-bold text-text-primary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-12 w-full border-3 border-text-primary rounded-sm bg-surface px-3 py-2 text-sm placeholder:text-text-secondary focus-visible:outline-none focus:outline-offset-0 focus:outline-2 focus:outline-accent-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-none transition-none',
                        error && 'border-accent-1 focus:outline-accent-1',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <span className="text-xs font-bold text-accent-1">{error}</span>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
