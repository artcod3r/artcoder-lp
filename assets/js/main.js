// Artcoder Main Client Logic & Resend API Integration

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Toast notification helper
  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.style.borderColor = isError ? '#ef4444' : '#FF6B00';
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Helper para envio via API Serverless do Resend
  async function sendEmailNotification(payload) {
    try {
      const response = await fetch('https://api.artcoder.com.br/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (err) {
      console.error('Erro de rede/servidor:', err);
      return { success: false };
    }
  }

  // Form Suporte Handler
  const formSuporte = document.getElementById('form-suporte');
  if (formSuporte) {
    formSuporte.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formSuporte.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const assunto = document.getElementById('assunto').value;
      const mensagem = document.getElementById('mensagem').value;

      const result = await sendEmailNotification({
        title: `Novo Contato de Suporte: ${assunto}`,
        subject: `[Artcoder Web] Contato: ${assunto}`,
        name: nome,
        email: email,
        extra: `Assunto selecionado: ${assunto}`,
        message: mensagem
      });

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      if (result.success) {
        showToast('Sua mensagem foi enviada com sucesso!');
        formSuporte.reset();
      } else {
        showToast('Erro ao enviar. Envie diretamente para artcoder@artcoder.com.br', true);
      }
    });
  }

  // Form Exclusao Handler
  const formExclusao = document.getElementById('form-exclusao');
  if (formExclusao) {
    formExclusao.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formExclusao.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando solicitação...';

      const nome = document.getElementById('exclusao-nome').value;
      const email = document.getElementById('exclusao-email').value;
      const app = document.getElementById('exclusao-app').value;
      const motivo = document.getElementById('exclusao-motivo').value || 'Não informado';

      const result = await sendEmailNotification({
        title: `SOLICITAÇÃO DE EXCLUSÃO DE CONTA - ${app}`,
        subject: `[URGENTE STORE] Solicitação Exclusão de Conta: ${app}`,
        name: nome,
        email: email,
        extra: `Aplicativo: ${app}`,
        message: `Motivo informado: ${motivo}`
      });

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      if (result.success) {
        showToast('Solicitação de exclusão enviada com sucesso!');
        formExclusao.reset();
      } else {
        showToast('Erro ao enviar. Envie e-mail para artcoder@artcoder.com.br', true);
      }
    });
  }

  // Products Carousel Logic
  const carouselContainer = document.getElementById('products-carousel');
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');
  const slides = document.querySelectorAll('.carousel-slide');

  if (carouselContainer && carouselTrack && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;
    const AUTOPLAY_DELAY = 6000;
    let autoplayTimer = null;

    function updateCarousel(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update slides accessibility
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i === currentIndex ? 'false' : 'true');
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        updateCarousel(currentIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Button event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
        resetAutoplay();
      });
    }

    // Dot event listeners
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateCarousel(index);
        resetAutoplay();
      });
    });

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Pause on focus
    carouselContainer.addEventListener('focusin', stopAutoplay);
    carouselContainer.addEventListener('focusout', startAutoplay);

    // Keyboard navigation
    carouselContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1);
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1);
        resetAutoplay();
      }
    });

    // Touch / Swipe support
    let touchStartX = 0;
    let touchStartY = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopAutoplay();
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and exceeds threshold
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          updateCarousel(currentIndex + 1);
        } else {
          updateCarousel(currentIndex - 1);
        }
      }
      startAutoplay();
    }, { passive: true });

    // Initialize carousel state
    updateCarousel(0);
    startAutoplay();
  }
});
