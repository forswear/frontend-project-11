import axios from 'axios';
import i18next from 'i18next';

const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid RSS format');
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

export const fetchAndParseRSS = async (url) => {
  try {
    const response = await axios.get('https://allorigins.hexlet.app/get', {
      params: {
        url,
        disableCache: true,
      },
    });
    const xmlString = response.data.contents;
    return parseRSS(xmlString);
  } catch (error) {
    throw new Error(i18next.t('errors.networkError'));
  }
};
