import './style.scss';
import setupFormValidation from './validation';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');

  setupFormValidation(form, feedback, input);
});