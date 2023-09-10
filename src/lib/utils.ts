import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'
import locale from 'date-fns/locale/pt-BR'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface DateProps {
  dateString: string
}

const formatDistanceLocale = {
  lessThanXSeconds: 'agora',
  xSeconds: 'agora',
  halfAMinute: 'agora',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}s',
  xWeeks: '{{count}}M',
  aboutXMonths: '{{count}}M',
  xMonths: '{{count}}M',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

export function formatTimeTitle(date: Date): string {
  return format(date, "eeee, d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: locale })
}

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())
  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'em ' + result
    } else {
      if (result === 'agora') return result
      return result + ' atrás'
    }
  }

  return result
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}
