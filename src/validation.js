import { fetchAndParseRSS } from './rss-parser';
import * as yup from 'yup';
import i18next from './locales/i18n';
import onChange from 'on-change';
import { renderPosts } from './view';

const updateInterval = 5000;

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

function checkForUpdates(feedsContainer, postsContainer, feedsData, readPosts) {
  const updatePromises = feedsData.map((feed) => {
    return new Promise((resolve) => {
      fetchAndParseRSS(feed.url)
        .then((newFeedData) => {
          const newPosts = newFeedData.posts.filter(
            (post) => !feed.posts.some((existingPost) => existingPost.id === post.id)
          );

          if (newPosts.length > 0) {
            feed.posts.push(...newPosts);
            renderPosts(postsContainer, feed.posts, readPosts);
            console.log(`Обнаружено ${newPosts.length} новых постов в фиде "${feed.title}"`);
          }

          resolve();
        })
        .catch((error) => {
          console.error(`Ошибка при обновлении фида "${feed.title}":`, error.message);
          resolve();
        });
    });
  });

  return Promise.all(updatePromises).then(() => {
    setTimeout(() => checkForUpdates(feedsContainer, postsContainer, feedsData, readPosts), updateInterval);
  });
}

export default function setupFormValidation(
  formElement,
  feedbackElement,
  inputElement,
  feedsContainer,
  postsContainer
) {
  let feedsData = [];
  const readPosts = new Set();

  const validateAndSubmit = (event) => {
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

    validationSchema
      .validate({ url }, { abortEarly: false })
      .then(() => {
        feedbackElement.textContent = i18next.t('loading');

        return fetchAndParseRSS(url);
      })
      .then((feedData) => {
        const feedItem = document.createElement('div');
        feedItem.classList.add('feed');
        feedItem.innerHTML = `
          <h3>${feedData.title}</h3>
          <p>${feedData.description}</p>
        `;
        feedsContainer.appendChild(feedItem);

        feedsData.push({ ...feedData, url });

        renderPosts(postsContainer, feedData.posts, readPosts);

        reactiveExistingFeeds.push(url.trim());
        formElement.reset();
        inputElement.focus();
        feedbackElement.textContent = '';

        if (feedsData.length === 1) {
          checkForUpdates(feedsContainer, postsContainer, feedsData, readPosts);
        }
      })
      .catch((error) => {
        if (error instanceof yup.ValidationError) {
          feedbackElement.textContent = error.errors[0];
        } else {
          feedbackElement.textContent = i18next.t('errors.failedToLoad');
        }
        inputElement.classList.add('is-invalid');
      });
  };

  formElement.addEventListener('submit', validateAndSubmit);
  inputElement.addEventListener('input', () => {
    feedbackElement.textContent = '';
    inputElement.classList.remove('is-invalid');
  });
}