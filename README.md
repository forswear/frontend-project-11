### Hexlet tests and linter status:
[![Actions Status](https://github.com/forswear/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/forswear/frontend-project-11/actions)
<a href="https://codeclimate.com/github/forswear/frontend-project-11/maintainability"><img src="https://api.codeclimate.com/v1/badges/3f2f35c454a12dd10bb7/maintainability" /></a>

# RSS Aggregator

RSS Aggregator — это простое и удобное веб-приложение для чтения RSS-лент. Оно позволяет добавлять RSS-ссылки, просматривать последние посты и автоматически обновлять ленту. Приложение поддерживает мультиязычность (русский и английский) и имеет интуитивно понятный интерфейс.

---

## Особенности

- **Добавление RSS-лент**: Введите ссылку на RSS-ленту, и приложение автоматически загрузит и отобразит последние посты.
- **Автоматическое обновление**: Лента обновляется каждые 5 секунд, чтобы вы всегда были в курсе последних новостей.
- **Мультиязычность**: Поддержка русского и английского языков.
- **Просмотр постов**: Вы можете просматривать посты прямо в приложении или переходить по ссылке на оригинальную статью.
- **Отметка прочитанных постов**: Посты, которые вы уже просмотрели, выделяются жирным шрифтом.

---

## Установка и запуск

1. **Клонируйте репозиторий**:
   ```bash
   git clone https://github.com/forswear/frontend-project-11
   cd frontend-project-11
   
2. **Установите зависимости**:
    ```bash
   npm install
    
2. **Запустите приложение**:
    ```bash
   npm start

---
    
## Использование

1. Введите ссылку на RSS-ленту в поле ввода и нажмите кнопку **"Добавить"**.
2. После успешной загрузки ленты вы увидите заголовок и описание RSS-канала, а также список последних постов.
3. Для просмотра поста нажмите кнопку **"Просмотр"** или перейдите по ссылке на оригинальную статью.
4. Посты, которые вы уже просмотрели, будут выделены.

---

## Технологии

- **JavaScript**: Основной язык программирования.
- **Bootstrap**: Используется для стилизации интерфейса.
- **Axios**: Для выполнения HTTP-запросов.
- **Yup**: Для валидации данных.
- **i18next**: Для поддержки мультиязычности.
- **DOMParser**: Для парсинга XML-данных RSS-лент.

---

## Структура проекта

- **`src/`**: Содержит весь исходный код приложения.
  - **`index.js`**: Основной файл, который запускает приложение и настраивает обработчики событий.
  - **`rss-parser.js`**: Модуль для загрузки и парсинга RSS-лент с использованием `DOMParser`.
  - **`validation.js`**: Логика валидации формы с помощью `yup` и обработка ошибок.
  - **`view.js`**: Отвечает за отображение постов и управление интерфейсом.
  - **`i18n.js`**: Настройка мультиязычности с использованием `i18next`.
  - **`style.scss`**: Стили приложения, включая Bootstrap.

- **`public/`**: Содержит статические файлы, такие как HTML-шаблон.
  - **`index.html`**: Основной HTML-файл, который загружается в браузере.

- **`package.json`**: Содержит список зависимостей и скриптов для запуска проекта.

- **`README.md`**: Документация проекта (этот файл).

- **`.gitignore`**: Указывает, какие файлы и папки должны игнорироваться Git.
