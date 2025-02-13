export const renderFeeds = (container, feeds) => {
  container.innerHTML = '';

  const feedsHeader = document.createElement('h2');
  feedsHeader.textContent = 'Фиды';
  container.appendChild(feedsHeader);

  feeds.forEach((feed) => {
    const feedItem = document.createElement('div');
    feedItem.classList.add('feed');
    feedItem.innerHTML = `
      <h3>${feed.title}</h3>
      <p>${feed.description}</p>
    `;
    container.appendChild(feedItem);
  });
};

export const renderPosts = (container, posts) => {
  container.innerHTML = '';

  const postsHeader = document.createElement('h2');
  postsHeader.textContent = 'Посты';
  container.appendChild(postsHeader);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
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
    postLink.classList.add('fw-bold');
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

  container.appendChild(postsList);
};