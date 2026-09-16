document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  const welcomeNotice = document.createElement('aside');
  welcomeNotice.className = 'welcome-notice';
  welcomeNotice.setAttribute('aria-label', 'Welcome message');
  welcomeNotice.innerHTML = '<div class="welcome-mark" aria-hidden="true">&</div><div class="welcome-copy"><span class="welcome-label">A warm welcome</span><p>welcome to frame &amp; soul by webbynihal agency</p></div><button class="welcome-close" type="button" aria-label="Dismiss welcome message">&times;</button>';
  document.body.append(welcomeNotice);

  const dismissWelcome = () => {
    welcomeNotice.classList.add('dismissed');
    sessionStorage.setItem('frame-soul-welcome-dismissed', 'true');
  };
  welcomeNotice.querySelector('.welcome-close').addEventListener('click', dismissWelcome);
  if (sessionStorage.getItem('frame-soul-welcome-dismissed') === 'true') welcomeNotice.classList.add('dismissed');

  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { setMenu(false); closeLightbox(); }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) setMenu(false); });
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .1 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    galleryItems.forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  }));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxCategory = document.querySelector('.lightbox-category');
  let activeIndex = 0;
  const visibleGallery = () => [...document.querySelectorAll('.gallery-item:not([hidden])')];
  const updateLightbox = () => {
    const items = visibleGallery();
    const item = items[activeIndex];
    if (!item || !lightboxImage) return;
    lightboxImage.src = item.querySelector('img').src;
    lightboxImage.alt = item.querySelector('img').alt;
    if (lightboxTitle) lightboxTitle.textContent = item.dataset.title || '';
    if (lightboxCategory) lightboxCategory.textContent = item.dataset.category || '';
  };
  const openLightbox = (item) => {
    activeIndex = visibleGallery().indexOf(item);
    updateLightbox();
    lightbox?.classList.add('open');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  };
  function closeLightbox() {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }
  galleryItems.forEach((item) => item.addEventListener('click', () => openLightbox(item)));
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.querySelector('.lightbox-prev')?.addEventListener('click', () => { const items = visibleGallery(); activeIndex = (activeIndex - 1 + items.length) % items.length; updateLightbox(); });
  document.querySelector('.lightbox-next')?.addEventListener('click', () => { const items = visibleGallery(); activeIndex = (activeIndex + 1) % items.length; updateLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'ArrowLeft') document.querySelector('.lightbox-prev')?.click();
    if (event.key === 'ArrowRight') document.querySelector('.lightbox-next')?.click();
  });

  const form = document.querySelector('#inquiry-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    const required = [...form.querySelectorAll('[required]')];
    const missing = required.some((field) => !field.value.trim());
    if (missing) { if (status) status.textContent = 'Please fill in the required fields.'; return; }
    if (status) status.textContent = 'Thank you. Your story is on its way to us.';
    form.reset();
  });
});
