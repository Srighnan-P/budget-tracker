'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'dots'
  className?: string
  text?: string
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  variant = 'default',
  className,
  text = 'Loading...'
}) => {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const containerSizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn(
          'animate-spin rounded-full border-2 border-muted border-t-primary',
          sizeClasses[size as keyof typeof sizeClasses]
        )} />
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center', containerSizeClasses[size as keyof typeof containerSizeClasses], className)}>
        <div className="flex space-x-1">
          <div className={cn(
            'rounded-full bg-primary animate-bounce',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          )} style={{ animationDelay: '0ms' }} />
          <div className={cn(
            'rounded-full bg-primary animate-bounce',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          )} style={{ animationDelay: '150ms' }} />
          <div className={cn(
            'rounded-full bg-primary animate-bounce',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          )} style={{ animationDelay: '300ms' }} />
        </div>
        {text && (
          <span className={cn(
            'text-muted-foreground font-medium',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
          )}>
            {text}
          </span>
        )}
      </div>
    )
  }

  return (
         <div className={cn('flex flex-col items-center justify-center', containerSizeClasses[size as keyof typeof containerSizeClasses], className)}>
       <div className="relative">
         {/* Outer ring */}
         <div className={cn(
           'animate-spin rounded-full border-2 border-muted',
           sizeClasses[size as keyof typeof sizeClasses]
         )} />
         {/* Inner spinning ring */}
         <div className={cn(
           'absolute top-0 left-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary',
           sizeClasses[size as keyof typeof sizeClasses]
         )} style={{ animationDuration: '1s' }} />
        {/* Center dot */}
        <div className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-pulse',
          size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : 'w-2 h-2'
        )} />
      </div>
      {text && (
        <span className={cn(
          'text-muted-foreground font-medium animate-pulse',
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        )}>
          {text}
        </span>
      )}
    </div>
  )
}

// Full page loading component
export const FullPageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 p-8">
        <Loading size="lg" text={text} />
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse" 
               style={{ 
                 width: '100%',
                 animation: 'loading-bar 2s ease-in-out infinite'
               }} />
        </div>
      </div>
      <style jsx>{`
        @keyframes loading-bar {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default Loading