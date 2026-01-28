import React, { type HTMLAttributes } from 'react';
import { cn } from './Button';

const Card = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-surface border-3 border-text-primary rounded-sm shadow-brutal-card transition-shadow duration-0 text-text-primary p-8',
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';

export { Card };
