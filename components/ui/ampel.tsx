'use client';

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AmpelStatus = 'gruen' | 'gelb' | 'rot';

export interface AmpelProps extends React.HTMLAttributes<HTMLDivElement> {
  status: AmpelStatus;
  title?: string;
  message?: string;
  pufferPunkte?: number;
}

const Ampel = React.forwardRef<HTMLDivElement, AmpelProps>(
  ({ className, status, title, message, pufferPunkte, ...props }, ref) => {
    const statusConfig = {
      gruen: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        title: title || 'Gute Aussichten',
        message: message || 'Ihre Angaben deuten auf eine gute Einschätzung hin.',
        icon: '✓',
      },
      gelb: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        title: title || 'Knappe Entscheidung',
        message: message || 'Die Einschätzung ist knapp. Eine genaue Prüfung lohnt sich.',
        icon: '⚠',
      },
      rot: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        title: title || 'Unter der Schwelle',
        message: message || 'Nach Ihren Angaben liegt die Einschätzung unter der Schwelle.',
        icon: '✗',
      },
    };

    const config = statusConfig[status];

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border-2 p-6',
          config.bgColor,
          config.borderColor,
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold',
            status === 'gruen' && 'bg-green-500 text-white',
            status === 'gelb' && 'bg-yellow-500 text-white',
            status === 'rot' && 'bg-red-500 text-white'
          )}>
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className={cn('text-xl font-bold mb-2', config.textColor)}>
              {config.title}
            </h3>
            <p className={cn('text-base', config.textColor)}>
              {config.message}
            </p>
            {pufferPunkte !== undefined && (
              <p className={cn('mt-2 text-sm', config.textColor)}>
                Puffer: {pufferPunkte > 0 ? `+${pufferPunkte}` : pufferPunkte} Punkte
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Ampel.displayName = 'Ampel';

export { Ampel, type AmpelStatus };
