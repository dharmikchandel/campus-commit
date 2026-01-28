import React, { type ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-bold tracking-tight focus:outline-none disabled:opacity-50 disabled:pointer-events-none border-3 border-text-primary rounded-sm transition-shadow',
                    {
                        'bg-accent-1 text-white shadow-brutal-btn hover:shadow-brutal-btn-hover': variant === 'primary' || variant === 'danger',
                        'bg-accent-2 text-white shadow-brutal-btn hover:shadow-brutal-btn-hover': variant === 'secondary',
                        'bg-transparent text-text-primary shadow-brutal-btn hover:shadow-brutal-btn-hover hover:bg-accent-2 hover:text-white': variant === 'outline',
                        'bg-transparent border-transparent shadow-none hover:bg-gray-100 dark:hover:bg-gray-800 border-2': variant === 'ghost',
                        'h-10 px-4 text-sm': size === 'sm',
                        'h-12 px-8 text-base': size === 'md',
                        'h-14 px-10 text-lg': size === 'lg',
                        'h-10 w-10 p-2 flex items-center justify-center': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, cn };
