import i18next from 'i18next';

const resources = {
  en: {
    translation: {
      title: 'RSS Aggregator',
      description: 'Start reading RSS today! It is easy and beautiful.',
      label: 'RSS Link',
      add: 'Add',
      example: 'Example: https://lorem-rss.hexlet.app/feed',
      loading: 'Loading...',
      rssAdded: 'RSS successfully',
      errors: {
        required: 'Field must not be empty',
        invalidUrl: 'Invalid URL format',
        duplicateFeed: 'RSS already exists',
        invalidRss: 'Resource does not contain valid RSS',
        networkError: 'Network error occurred',
      },
    },
  },
  ru: {
    translation: {
      title: 'RSS Агрегатор',
      description: 'Начните читать RSS сегодня! Это легко и красиво.',
      label: 'Ссылка RSS',
      add: 'Добавить',
      example: 'Пример: https://lorem-rss.hexlet.app/feed',
      loading: 'Загрузка...',
      rssAdded: 'RSS успешно загружен',
      errors: {
        required: 'Это обязательное поле',
        invalidUrl: 'Ссылка должна быть валидным URL',
        duplicateFeed: 'RSS уже существует',
        invalidRss: 'Ресурс не содержит валидный RSS',
        networkError: 'Ошибка сети',
      },
    },
  },
};

export const initI18n = (callback) => {
  i18next.init({
    lng: 'ru',
    fallbackLng: 'en',
    resources,
  }, callback);
};

export default i18next;
