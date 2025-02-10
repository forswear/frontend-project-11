import onChange from 'on-change';
import * as yup from 'yup';
import i18next from './locales/i18n';

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

export default function setupFormValidation(formElement, feedbackElement, inputElement) {
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
        console.log('URL добавлен:', url);
        formElement.reset();
        inputElement.focus();
        reactiveExistingFeeds.push(url.trim());
      })
      .catch((error) => {
        if (error instanceof yup.ValidationError) {
          feedbackElement.textContent = error.errors[0];
          inputElement.classList.add('is-invalid');
        } else {
          console.error('Произошла ошибка:', error);
        }
      });
  };

  formElement.addEventListener('submit', validateAndSubmit);

  inputElement.addEventListener('input', () => {
    feedbackElement.textContent = '';
    inputElement.classList.remove('is-invalid');
  });

  inputElement.addEventListener('change', () => {
    const value = inputElement.value.trim();
    if (!value) {
      return;
    }
    validationSchema
      .validate({ url: value }, { abortEarly: false })
      .then(() => {
        feedbackElement.textContent = '';
        inputElement.classList.remove('is-invalid');
      })
      .catch((error) => {
        if (error instanceof yup.ValidationError) {
          feedbackElement.textContent = error.errors[0];
          inputElement.classList.add('is-invalid');
        }
      });
  });
}