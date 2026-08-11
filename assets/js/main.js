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
});
