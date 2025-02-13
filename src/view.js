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

  const existingPosts = Array.from(postsList.children);
  existingPosts.forEach((postItem) => {
    const postId = postItem.querySelector('a').dataset.id;
    if (!posts.some((post) => post.id === postId)) {
      postItem.remove();
    }
  });

  posts.forEach((post) => {
    const existingPostItem = postsList.querySelector(`a[data-id="${post.id}"]`);
    if (!existingPostItem) {
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

      viewButton.addEventListener('click', () => {
        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');
        const fullArticleLink = document.querySelector('.full-article');
      
        modalTitle.textContent = post.title;
        modalBody.textContent = post.description || 'Описание отсутствует';
        fullArticleLink.href = post.link;
      
        readPosts.add(post.id);
        postLink.classList.remove('fw-bold');
        postLink.classList.add('fw-normal');
      });

      postItem.appendChild(postLink);
      postItem.appendChild(viewButton);
      postsList.appendChild(postItem);
    }
  });
};