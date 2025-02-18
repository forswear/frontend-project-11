import './style.scss';
import 'bootstrap';
import setupFormValidation from './validation.js';
import { initI18n } from './locales/i18n.js';

initI18n(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.rss-form');
    const input = document.getElementById('url-input');
    const feedback = document.querySelector('.feedback');
    const feedsContainer = document.querySelector('.feeds');
    const postsContainer = document.querySelector('.posts');

    setupFormValidation({
      formElement: form,
      feedbackElement: feedback,
      inputElement: input,
      feedsContainer,
      postsContainer,
    });
  });
});