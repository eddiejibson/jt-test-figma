import i18next from 'i18next'
import {
  initReactI18next,
  useTranslation as librayUseTranslation,
} from 'react-i18next'
import {} from 'react-i18next'
import en from './resources/en.json'

export const resources = {
  en: {
    translation: en,
  },
}

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  resources,
})

export const useTranslation = () => librayUseTranslation('')