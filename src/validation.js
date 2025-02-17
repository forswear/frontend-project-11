import { fetchAndParseRSS } from './rss-parser';
import * as yup from 'yup';
import i18next from './locales/i18n';
import onChange from 'on-change';
import { renderPosts, renderFeeds, renderModal, renderFormFeedback } from './view';

export const createState = (feedsContainer, postsContainer, feedbackElement, inputElement) => {
  const initialState = {
    feedsData: [],
    allPosts: [],
    readPosts: new Set(),
    formError: null,
    isUpdating: false,
    currentPost: null,
  };

  const state = onChange(initialState, (path, value) => {
    if (path === 'feedsData') {
      state.allPosts = state.feedsData.flatMap((feed) => feed.posts);
      renderFeeds(feedsContainer, state.feedsData);
      renderPosts(postsContainer, state.allPosts, state.readPosts);
    }
    if (path === 'readPosts') {
      renderPosts(postsContainer, state.allPosts, state.readPosts);
    }
    if (path === 'formError') {
      renderFormFeedback(inputElement, feedbackElement, value);
    }
    if (path === 'currentPost') {
      renderModal(state.currentPost);
    }
  });

  return state;
};

const updateInterval = 5000;

function checkForUpdates(state) {
  if (state.feedsData.length === 0) {
    return;
  }

  const updatePromises = state.feedsData.map((feed) =>
    fetchAndParseRSS(feed.url)
      .then((newFeedData) => {
        const newPosts = newFeedData.posts.filter(
          (post) => !feed.posts.some((existingPost) => existingPost.id === post.id)
        );
        if (newPosts.length > 0) {
          feed.posts.push(...newPosts);
          state.allPosts = state.feedsData.flatMap((feed) => feed.posts);
          console.log(`Обнаружено ${newPosts.length} новых постов в фиде "${feed.title}"`);
        }
      })
      .catch((error) => {
        console.error(`Ошибка при обновлении фида "${feed.title}":`, error.message);
      })
  );

  Promise.all(updatePromises).then(() => {
    setTimeout(() => checkForUpdates(state), updateInterval);
  });
}

const setupPostViewHandler = (postsContainer, state) => {
  postsContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const postId = event.target.dataset.id;
      const post = state.allPosts.find((p) => p.id === postId);

      if (post) {
        state.currentPost = post;
        state.readPosts.add(postId);

        const postLink = postsContainer.querySelector(`a[data-id="${postId}"]`);
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
  const state = createState(feedsContainer, postsContainer, feedbackElement, inputElement);

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
        state.allPosts = state.feedsData.flatMap((feed) => feed.posts);
        formElement.reset();
        inputElement.focus();
        resetFormState();
  
        checkForUpdates(state);
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
  setupPostViewHandler(postsContainer, state);
}