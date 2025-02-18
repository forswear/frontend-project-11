import axios from 'axios';
import i18next from './locales/i18n.js';

const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const parseError = xmlDoc.querySelector('parsererror');

  if (parseError) {
    throw new Error(i18next.t('errors.invalidRss'));
  }

  const channel = xmlDoc.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;

  const items = Array.from(channel.querySelectorAll('item')).map((item) => ({
    id: crypto.randomUUID(),
    title: item.querySelector('title')?.textContent || 'No Title',
    link: item.querySelector('link')?.textContent || '#',
    pubDate: item.querySelector('pubDate')?.textContent || '',
    description: item.querySelector('description')?.textContent || 'Описание отсутствует',
  }));

  return {
    id: crypto.randomUUID(),
    title,
    description,
    posts: items,
  };
};

const fetchAndParseRSS = (url) => axios.get('https://allorigins.hexlet.app/get', {
  params: {
    url,
    disableCache: true,
  },
})
  .then((response) => {
    const xmlString = response.data.contents;
    try {
      return parseRSS(xmlString);
    } catch (error) {
      if (error.message === i18next.t('errors.invalidRss')) {
        throw new Error(i18next.t('errors.invalidRss'));
      }
      throw new Error(i18next.t('errors.networkError'));
    }
  })
  .catch((error) => {
    if (error.response && error.response.status === 404) {
      throw new Error(i18next.t('errors.invalidUrl'));
    }
    if (error.message === i18next.t('errors.invalidRss')) {
      throw error;
    }
    throw new Error(i18next.t('errors.networkError'));
  });

export default fetchAndParseRSS;
