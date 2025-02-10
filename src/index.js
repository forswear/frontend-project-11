import './style.scss';
import setupFormValidation from './validation';
import i18next from './locales/i18n';
import * as yup from 'yup';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');

  document.title = i18next.t('title');
  document.querySelector('h1').textContent = i18next.t('title');
  document.querySelector('.lead').textContent = i18next.t('description');
  document.querySelector('.form-floating label').textContent = i18next.t('placeholder');
  document.querySelector('.rss-form button').textContent = i18next.t('submitButton');
  document.querySelector('.text-muted').textContent = i18next.t('example');

  setupFormValidation(form, feedback, input);
});

yup.setLocale({
  mixed: {
    required: i18next.t('errors.required'),
  },
  string: {
    url: i18next.t('errors.invalidUrl'),
  },
});