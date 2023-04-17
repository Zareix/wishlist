import * as React from 'react';

import { cn } from '@/utils/ui';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type InputGroupProps = React.InputHTMLAttributes<HTMLDivElement>;
export type InputErrorProps = React.InputHTMLAttributes<HTMLParagraphElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('grid w-full max-w-sm gap-1.5', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
InputGroup.displayName = 'InputGroup';

const InputError = React.forwardRef<HTMLParagraphElement, InputErrorProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        className={cn('text-sm text-red-700 dark:text-red-500', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
InputError.displayName = 'InputError';

export { Input, InputGroup, InputError };
