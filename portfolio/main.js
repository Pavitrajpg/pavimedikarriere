// Nav toggle (mobile)
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Experience accordion
  document.querySelectorAll('.exp-card').forEach(card => {
    const head = card.querySelector('.exp-head');
    const body = card.querySelector('.exp-body');
    if (!head || !body) return;
    head.addEventListener('click', () => {
      const isOpen = card.getAttribute('data-open') === 'true';
      // close others
      document.querySelectorAll('.exp-card[data-open="true"]').forEach(other => {
        if (other !== card) {
          other.setAttribute('data-open', 'false');
          other.querySelector('.exp-body').style.maxHeight = null;
          other.querySelector('.exp-head').setAttribute('aria-expanded', 'false');
        }
      });
      card.setAttribute('data-open', String(!isOpen));
      head.setAttribute('aria-expanded', String(!isOpen));
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Active nav link highlight based on current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
});
