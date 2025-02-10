// src/locales/i18n.js
import i18next from 'i18next';

const resources = {
  en: {
    translation: {
      title: 'RSS Aggregator',
      description: 'Start reading RSS today! It is easy and beautiful.',
      placeholder: 'RSS Link',
      submitButton: 'Add',
      example: 'Example: https://lorem-rss.hexlet.app/feed',
      errors: {
        required: 'Field must not be empty',
        invalidUrl: 'Invalid URL format',
        duplicateFeed: 'RSS already exists',
      },
    },
  },
  ru: {
    translation: {
      title: 'RSS Агрегатор',
      description: 'Начните читать RSS сегодня! Это легко, это красиво.',
      placeholder: 'Ссылка RSS',
      submitButton: 'Добавить',
      example: 'Пример: https://lorem-rss.hexlet.app/feed',
      errors: {
        required: 'Поле не должно быть пустым',
        invalidUrl: 'Неверный формат URL',
        duplicateFeed: 'RSS уже существует',
      },
    },
  },
};

i18next.init({
  lng: 'ru', // Язык по умолчанию
  fallbackLng: 'en', // Резервный язык
  resources,
});

export default i18next;