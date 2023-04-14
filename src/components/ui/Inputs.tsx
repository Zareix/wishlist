import * as React from 'react';

import { cn } from '@/utils/ui';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type InputGroupProps = React.InputHTMLAttributes<HTMLDivElement>;
export type InputErrorProps = React.InputHTMLAttributes<HTMLParagraphElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
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
