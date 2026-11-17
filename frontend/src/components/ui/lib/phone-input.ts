import { getCountryCallingCode, type Country } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'
import es from 'react-phone-number-input/locale/es.json'

type CountryLabels = typeof en

/** Nombres de país en el idioma de la app; `en` para cualquier otro. */
function getCountryLabels(language: string | undefined): CountryLabels {
  return language?.toLowerCase().startsWith('es') ? es : en
}

/** Texto que filtra cmdk: nombre, prefijo (`+52`) y código ISO (`MX`). */
function getCountrySearchValue(country: Country, label: string): string {
  return `${label} +${getCountryCallingCode(country)} ${country}`
}

export { getCountryLabels, getCountrySearchValue }
export type { CountryLabels }
