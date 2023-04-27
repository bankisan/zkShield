import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'

import { classNameMerge } from '@/utils/classNameMerge'
import { LucideIcon } from 'lucide-react'

const buttonVariants = cva(
  'outline-none inline-flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        outline:
          'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100',
        subtle:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
        ghost:
          'bg-transparent dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  iconPosition?: 'left' | 'right'
  Icon?: LucideIcon
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      Icon,
      children,
      className,
      disabled,
      iconPosition,
      isLoading,
      size,
      variant,
      ...props
    },
    ref
  ) => {
    if (Icon && !iconPosition) {
      iconPosition = 'left'
    }
    return (
      <button
        className={classNameMerge(buttonVariants({ variant, size, className }))}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <svg
            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        ) : Icon && iconPosition === 'left' ? (
          <Icon className='mr-2 h-4 w-4' />
        ) : null}
        {children}
        {Icon && iconPosition === 'right' && !isLoading ? (
          <Icon className='ml-2 h-4 w-4' />
        ) : null}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
