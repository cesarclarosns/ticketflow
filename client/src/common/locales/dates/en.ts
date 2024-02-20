import en from 'date-fns/locale/en-US'
import { Locale } from 'date-fns'

const formatRelativeLocale = {
  lastWeek: "'Last' eeee, HH:mm 'hrs'",
  yesterday: "'Yesterday', HH:mm 'hrs'",
  today: "'Today', HH:mm 'hrs'",
  tomorrow: "'Tomorrow', HH:mm 'hrs'",
  nextWeek: "'Next' eeee, HH:mm 'hrs'",
  other: "dd/MM/yyyy, HH:mm 'hrs'",
}

export const locale: Locale = {
  ...en,
  formatRelative: (token: keyof typeof formatRelativeLocale) =>
    formatRelativeLocale[token],
  options: {
    weekStartsOn: 1,
  },
}
