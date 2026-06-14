document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      navbar.classList.toggle('scrolled', currentScroll > 20);
      lastScroll = currentScroll;
    }, { passive: true });
  }

  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  let animationIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement ? 
          Array.from(entry.target.parentElement.querySelectorAll('.animate-on-scroll')) : [];
        const index = siblings.indexOf(entry.target);
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
        input.style.borderColor = '';
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const whatsapp = document.getElementById('whatsapp');
      const serviceType = document.getElementById('serviceType');
      const submitBtn = document.getElementById('submitBtn');

      let isValid = true;

      [fullName, email, whatsapp, serviceType].forEach(input => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      });

      if (!fullName.value.trim()) {
        setInvalid(fullName);
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        setInvalid(email);
        isValid = false;
      }

      if (!whatsapp.value.trim()) {
        setInvalid(whatsapp);
        isValid = false;
      }

      if (!serviceType.value) {
        setInvalid(serviceType);
        isValid = false;
      }

      if (isValid) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 11-6.219-8.56"></path>
          </svg>
          Mengirim...
        `;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          
          const modal = document.getElementById('successModal');
          if (modal) {
            modal.classList.add('active');
          }

          orderForm.reset();
        }, 800);
      } else {
        orderForm.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          orderForm.style.animation = '';
        }, 400);
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
      }
    }, { passive: true });
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setInvalid(input) {
  input.style.borderColor = '#ef4444';
  input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
  }
  window.location.href = 'index.html';
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('successModal');
  if (modal && e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('successModal');
    if (modal && modal.classList.contains('active')) {
      closeModal();
    }
  }
});

const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);