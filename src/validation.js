import { fetchAndParseRSS } from './rss-parser';
import * as yup from 'yup';
import i18next from './locales/i18n';
import onChange from 'on-change';
import { renderPosts, renderFeeds } from './view';

export const state = onChange(
  {
    feedsData: [],
    readPosts: new Set(),
    formError: null,
  },
  (path, value) => {
    if (path === 'feedsData') {
      const feedsContainer = document.querySelector('.feeds');
      const postsContainer = document.querySelector('.posts');
      renderFeeds(feedsContainer, state.feedsData);
      renderPosts(postsContainer, state.feedsData.flatMap((feed) => feed.posts), state.readPosts);
    }
    if (path === 'readPosts') {
      const postsContainer = document.querySelector('.posts');
      renderPosts(postsContainer, state.feedsData.flatMap((feed) => feed.posts), state.readPosts);
    }
    if (path === 'formError') {
      const feedbackElement = document.querySelector('.feedback');
      const inputElement = document.getElementById('url-input');

      if (value) {
        feedbackElement.textContent = value;
        inputElement.classList.add('is-invalid');
      } else {
        feedbackElement.textContent = '';
        inputElement.classList.remove('is-invalid');
      }
    }
  }
);

const updateInterval = 5000;
let isUpdating = false;

function checkForUpdates() {
  const updatePromises = state.feedsData.map((feed) =>
    fetchAndParseRSS(feed.url)
      .then((newFeedData) => {
        const newPosts = newFeedData.posts.filter(
          (post) => !feed.posts.some((existingPost) => existingPost.id === post.id)
        );
        if (newPosts.length > 0) {
          feed.posts.push(...newPosts);
          console.log(`Обнаружено ${newPosts.length} новых постов в фиде "${feed.title}"`);
        }
      })
      .catch((error) => {
        console.error(`Ошибка при обновлении фида "${feed.title}":`, error.message);
      })
  );

  return Promise.all(updatePromises).then(() => {
    setTimeout(checkForUpdates, updateInterval);
  });
}

const setupPostViewHandler = () => {
  const postsContainer = document.querySelector('.posts');

  postsContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const postId = event.target.dataset.id;

      const post = state.feedsData.flatMap((feed) => feed.posts).find((p) => p.id === postId);

      if (post) {
        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');
        const fullArticleLink = document.querySelector('.full-article');

        modalTitle.textContent = post.title;
        modalBody.textContent = post.description || 'Описание отсутствует';
        fullArticleLink.href = post.link;

        state.readPosts.add(postId);

        const postLink = document.querySelector(`a[data-id="${postId}"]`);
        if (postLink) {
          postLink.classList.remove('fw-bold');
          postLink.classList.add('fw-normal');
        }
      }
    }
  });
};

export default function setupFormValidation({
  formElement,
  feedbackElement,
  inputElement,
  feedsContainer,
  postsContainer,
}) {
  const validationSchema = yup.object().shape({
    url: yup
      .string()
      .trim()
      .required(i18next.t('errors.required'))
      .url(i18next.t('errors.invalidUrl'))
      .test('is-unique', i18next.t('errors.duplicateFeed'), (value) => {
        return !state.feedsData.some((feed) => feed.url === value.trim());
      }),
  });

  const resetFormState = () => {
    state.formError = null;
  };

  const validateAndSubmit = (event) => {
    event.preventDefault();
    resetFormState();

    const formData = new FormData(formElement);
    const { url } = Object.fromEntries(formData.entries());

    validationSchema
      .validate({ url }, { abortEarly: false })
      .then(() => {
        state.formError = i18next.t('loading');
        return fetchAndParseRSS(url.trim());
      })
      .then((feedData) => {
        state.feedsData = [...state.feedsData, { ...feedData, url: url.trim() }];
        formElement.reset();
        inputElement.focus();
        resetFormState();

        if (!isUpdating && state.feedsData.length > 0) {
          isUpdating = true;
          checkForUpdates();
        }
      })
      .catch((error) => {
        if (error instanceof yup.ValidationError) {
          state.formError = error.errors[0];
        } else {
          state.formError = error.message;
        }
      });
  };

  formElement.addEventListener('submit', validateAndSubmit);

  inputElement.addEventListener('input', resetFormState);

  setupPostViewHandler();
}