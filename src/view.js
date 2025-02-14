export const renderPosts = (container, posts, readPosts) => {
  if (container.innerHTML === '') {
    const postsHeader = document.createElement('h2');
    postsHeader.textContent = 'Посты';
    container.appendChild(postsHeader);

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');
    container.appendChild(postsList);
  }

  const postsList = container.querySelector('ul');
  postsList.innerHTML = '';

  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
    const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
    return dateB - dateA;
  });

  const lastTenPosts = sortedPosts.slice(0, 10);

  lastTenPosts.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0'
    );

    const postLink = document.createElement('a');
    postLink.href = post.link;
    postLink.classList.add(readPosts.has(post.id) ? 'fw-normal' : 'fw-bold');
    postLink.dataset.id = post.id;
    postLink.target = '_blank';
    postLink.rel = 'noopener noreferrer';
    postLink.textContent = `${post.title} ${post.pubDate || ''}`;

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
  container.innerHTML = '';

  if (feeds.length === 0) {
    return;
  }

  const feedsHeader = document.createElement('h2');
  feedsHeader.textContent = 'Ленты';
  container.appendChild(feedsHeader);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');
  container.appendChild(feedsList);

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