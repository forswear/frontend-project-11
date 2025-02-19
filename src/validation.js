/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import onChange from 'on-change';
import fetchAndParseRSS from './rss-parser.js';
import i18next from './locales/i18n.js';
import { renderPosts, renderFeeds, renderModal } from './view.js';

export const createState = (feedsContainer, postsContainer, feedbackElement, inputElement) => {
  const initialState = {
    feedsData: [],
    allPosts: [],
    readPosts: new Set(),
    formError: null,
    isUpdating: false,
    currentPost: null,
    isFormProcessing: false,
    successMessage: null,
  };

  const state = onChange(initialState, (path, value) => {
    if (path === 'feedsData') {
      state.allPosts = state.feedsData.flatMap((feedItem) => feedItem.posts);
      renderFeeds(feedsContainer, state.feedsData);
      renderPosts(postsContainer, state.allPosts, state.readPosts);
    }
    if (path === 'readPosts') {
      renderPosts(postsContainer, state.allPosts, state.readPosts);
    }
    if (path === 'formError') {
      const feedbackEl = feedbackElement;
      if (value) {
        feedbackEl.textContent = value;
        inputElement.classList.add('is-invalid');
      } else {
        feedbackEl.textContent = '';
        inputElement.classList.remove('is-invalid');
      }
    }
    if (path === 'currentPost') {
      renderModal(value);
      if (value) {
        state.readPosts.add(value.id);
      }
    }
    if (path === 'isFormProcessing') {
      if (value) {
        inputElement.setAttribute('readonly', true);
      } else {
        inputElement.removeAttribute('readonly');
      }
    }
    if (path === 'successMessage') {
      const feedbackEl = feedbackElement;
      if (value) {
        feedbackEl.textContent = value;
        feedbackEl.classList.remove('text-danger');
        feedbackEl.classList.add('text-success');
      } else {
        feedbackEl.textContent = '';
      }
    }
  });

  return state;
};

const updateInterval = 5000;

function checkForUpdates(state) {
  if (state.isUpdating || state.feedsData.length === 0) {
    return;
  }

  const updatedState = { ...state, isUpdating: true };

  const updatePromises = updatedState.feedsData.map((feedItem) => fetchAndParseRSS(feedItem.url)
    .then((newFeedData) => {
      const newPosts = newFeedData.posts.filter(
        (post) => !feedItem.posts.some((existingPost) => existingPost.id === post.id),
      );
      if (newPosts.length > 0) {
        feedItem.posts.push(...newPosts);
        updatedState.allPosts = updatedState.feedsData.flatMap((feed) => feed.posts);
      }
    })
    .catch((error) => {
      console.error(`Ошибка при обновлении фида "${feedItem.title}":`, error.message);
    }));

  Promise.all(updatePromises).then(() => {
    updatedState.isUpdating = false;
    setTimeout(() => checkForUpdates(updatedState), updateInterval);
  });
}

const setupPostViewHandler = (postsContainer, state) => {
  postsContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const postId = event.target.dataset.id;
      const post = state.allPosts.find((p) => p.id === postId);

      if (post) {
        state.currentPost = post;
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
  const state = createState(feedsContainer, postsContainer, feedbackElement, inputElement);

  const validationSchema = yup.object().shape({
    url: yup
      .string()
      .trim()
      .required(i18next.t('errors.required'))
      .url(i18next.t('errors.invalidUrl'))
      .test('is-unique', i18next.t('errors.duplicateFeed'), (value) => !state.feedsData.some((feed) => feed.url === value.trim())),
  });

  const resetFormState = () => {
    state.formError = null;
    state.isFormProcessing = false;
  };

  const validateAndSubmit = async (event) => {
    event.preventDefault();
    resetFormState();
    state.isFormProcessing = true;

    const formData = new FormData(formElement);
    const { url } = Object.fromEntries(formData.entries());

    try {
      await validationSchema.validate({ url }, { abortEarly: false });
      state.formError = i18next.t('loading');
      const feedData = await fetchAndParseRSS(url.trim());

      const uniquePosts = feedData.posts.filter(
        (post) => !state.allPosts.some((existingPost) => existingPost.id === post.id),
      );

      state.feedsData = [...state.feedsData, { ...feedData, url: url.trim(), posts: uniquePosts }];
      state.allPosts = state.feedsData.flatMap((feed) => feed.posts);

      formElement.reset();
      inputElement.focus();
      resetFormState();
      state.successMessage = i18next.t('rssAdded');
    } catch (error) {
      state.isFormProcessing = false;
      if (error instanceof yup.ValidationError) {
        const [firstError] = error.errors;
        state.formError = firstError;
      } else {
        state.formError = error.message;
      }
    }
  };

  formElement.addEventListener('submit', validateAndSubmit);
  inputElement.addEventListener('input', resetFormState);
  setupPostViewHandler(postsContainer, state);
  checkForUpdates(state);
}
