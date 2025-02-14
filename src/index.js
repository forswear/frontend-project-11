import './style.scss';
import setupFormValidation from './validation';

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