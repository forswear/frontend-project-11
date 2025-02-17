import { fetchAndParseRSS } from './rss-parser';
import * as yup from 'yup';
import i18next from './locales/i18n';
import onChange from 'on-change';
import { renderPosts, renderFeeds, renderModal } from './view';

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
      state.allPosts = state.feedsData.flatMap((feed) => feed.posts);
      renderFeeds(feedsContainer, state.feedsData);
      renderPosts(postsContainer, state.allPosts, state.readPosts);
    }
    if (path === 'readPosts') {
      renderPosts(postsContainer, state.allPosts, state.readPosts);
    }
    if (path === 'formError') {
      if (value) {
        feedbackElement.textContent = value;
        inputElement.classList.add('is-invalid');
      } else {
        feedbackElement.textContent = '';
        inputElement.classList.remove('is-invalid');
      }
    }
    if (path === 'currentPost') {
      renderModal(state.currentPost);
    }
    if (path === 'isFormProcessing') {
      if (value) {
        inputElement.setAttribute('readonly', true);
      } else {
        inputElement.removeAttribute('readonly');
      }
    }
    if (path === 'successMessage') {
      if (value) {
        feedbackElement.textContent = value;
        feedbackElement.classList.remove('text-danger');
        feedbackElement.classList.add('text-success');
      } else {
        feedbackElement.textContent = '';
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

  state.isUpdating = true;

  const updatePromises = state.feedsData.map((feed) =>
    fetchAndParseRSS(feed.url)
      .then((newFeedData) => {
        const newPosts = newFeedData.posts.filter(
          (post) => !feed.posts.some((existingPost) => existingPost.id === post.id)
        );
        if (newPosts.length > 0) {
          feed.posts.push(...newPosts);
          state.allPosts = state.feedsData.flatMap((feed) => feed.posts);
        }
      })
      .catch((error) => {
        console.error(`Ошибка при обновлении фида "${feed.title}":`, error.message);
      })
  );

  Promise.all(updatePromises).then(() => {
    state.isUpdating = false;
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
      state.feedsData = [...state.feedsData, { ...feedData, url: url.trim() }];
      state.allPosts = state.feedsData.flatMap((feed) => feed.posts);
      formElement.reset();
      inputElement.focus();
      resetFormState();
      state.successMessage = i18next.t('rssAdded');
      checkForUpdates(state);
    } catch (error) {
      state.isFormProcessing = false;
      if (error instanceof yup.ValidationError) {
        state.formError = error.errors[0];
      } else {
        state.formError = error.message; // Здесь ошибка будет передана в состояние
      }
    }
  }; 

  formElement.addEventListener('submit', validateAndSubmit);
  inputElement.addEventListener('input', resetFormState);
  setupPostViewHandler(postsContainer, state);
}