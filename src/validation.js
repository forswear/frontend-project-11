import { fetchAndParseRSS } from './rss-parser';
import * as yup from 'yup';
import i18next from './locales/i18n';
import onChange from 'on-change';
import { renderFeeds, renderPosts } from './view';

let existingFeeds = [];
const reactiveExistingFeeds = onChange(existingFeeds, (path, value) => {
  console.log(`Изменение в existingFeeds: ${path} -> ${value}`);
});

const validationSchema = yup.object().shape({
  url: yup
    .string()
    .url(i18next.t('errors.invalidUrl'))
    .test('is-unique', i18next.t('errors.duplicateFeed'), (value) => {
      return !reactiveExistingFeeds.includes(value);
    })
    .required(i18next.t('errors.required')),
});

export default function setupFormValidation(
  formElement,
  feedbackElement,
  inputElement,
  feedsContainer,
  postsContainer
) {
  const validateAndSubmit = async (event) => {
    event.preventDefault();
    feedbackElement.textContent = '';
    inputElement.classList.remove('is-invalid');

    const formData = new FormData(formElement);
    const { url } = Object.fromEntries(formData.entries());

    if (!url.trim()) {
      feedbackElement.textContent = i18next.t('errors.required');
      inputElement.classList.add('is-invalid');
      return;
    }

    try {
      await validationSchema.validate({ url }, { abortEarly: false });

      feedbackElement.textContent = i18next.t('loading');
      const feedData = await fetchAndParseRSS(url);

      const feedItem = document.createElement('div');
      feedItem.classList.add('feed');
      feedItem.innerHTML = `
        <h3>${feedData.title}</h3>
        <p>${feedData.description}</p>
      `;
      feedsContainer.appendChild(feedItem);

      renderPosts(postsContainer, feedData.posts);

      reactiveExistingFeeds.push(url.trim());
      formElement.reset();
      inputElement.focus();
      feedbackElement.textContent = '';

      renderFeeds(feedsContainer, [feedData]);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        feedbackElement.textContent = error.errors[0];
      } else {
        feedbackElement.textContent = i18next.t('errors.failedToLoad');
      }
      inputElement.classList.add('is-invalid');
    }
  };

  formElement.addEventListener('submit', validateAndSubmit);
  inputElement.addEventListener('input', () => {
    feedbackElement.textContent = '';
    inputElement.classList.remove('is-invalid');
  });
}