import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Simple inline resources; for production, use separate JSON files in locales/
const resources = {
  en: {
    translation: {
      'Rural Indians Benefited in 2025': 'Rural Indians Benefited in 2025',
      'Districts in Uttar Pradesh': 'Districts in Uttar Pradesh',
      'Daily Wage Rate': 'Daily Wage Rate',
      'Days Guaranteed Employment': 'Days Guaranteed Employment',
      'Track Your District\'s MGNREGA Performance': "Track Your District's MGNREGA Performance",
      // ...add more keys as needed...
    }
  },
  hi: {
    translation: {
      'Rural Indians Benefited in 2025': '2025 में लाभान्वित हुए ग्रामीण भारतीय',
      'Districts in Uttar Pradesh': 'उत्तर प्रदेश के जिले',
      'Daily Wage Rate': 'दैनिक मज़दूरी दर',
      'Days Guaranteed Employment': 'रोजगार की गारंटी वाले दिन',
      'Track Your District\'s MGNREGA Performance': 'अपने जिले का मनरेगा प्रदर्शन देखें',
      // ...add more keys as needed...
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }});

export default i18n;

