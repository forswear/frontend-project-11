export const renderModal = (post) => {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const fullArticleLink = document.querySelector('.full-article');

  if (post) {
    modalTitle.textContent = post.title;
    modalBody.textContent = post.description || 'Описание отсутствует';
    fullArticleLink.href = post.link;
  }
};

export const renderPosts = (container, posts, readPosts) => {
  const postsContainer = container;
  if (postsContainer.innerHTML === '') {
    const postsHeader = document.createElement('h2');
    postsHeader.textContent = 'Посты';
    postsContainer.appendChild(postsHeader);

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');
    postsContainer.appendChild(postsList);
  }

  const postsList = postsContainer.querySelector('ul');
  postsList.innerHTML = '';

  const sortedPosts = [...posts]
    .sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
      const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
      return dateB - dateA;
    })
    .slice(0, 10);

  sortedPosts.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const postLink = document.createElement('a');
    postLink.href = post.link;
    postLink.id = `post-${post.id}`;
    postLink.classList.add(readPosts.has(post.id) ? 'fw-normal' : 'fw-bold');
    postLink.dataset.id = post.id;
    postLink.target = '_blank';
    postLink.rel = 'noopener noreferrer';
    postLink.textContent = post.title + (post.pubDate ? ` (${post.pubDate})` : '');

    const viewButton = document.createElement('button');
    viewButton.type = 'button';
    viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    viewButton.dataset.id = post.id;
    viewButton.dataset.bsToggle = 'modal';
    viewButton.dataset.bsTarget = '#modal';
    viewButton.textContent = 'Просмотр';

    postItem.appendChild(postLink);
    postItem.appendChild(viewButton);
    postsList.appendChild(postItem);
  });
};

export const renderFeeds = (container, feeds) => {
  const feedsContainer = container;
  feedsContainer.innerHTML = '';

  if (feeds.length === 0) {
    return;
  }

  const feedsHeader = document.createElement('h2');
  feedsHeader.textContent = 'Фиды';
  feedsContainer.appendChild(feedsHeader);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');
  feedsContainer.appendChild(feedsList);

  feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.textContent = feed.description;

    feedItem.appendChild(feedTitle);
    feedItem.appendChild(feedDescription);
    feedsList.appendChild(feedItem);
  });
};
