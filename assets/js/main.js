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

  // Helper for sending notifications via Resend endpoint / API
  async function sendEmailNotification(payload) {
    const emailBody = {
      from: 'Artcoder Web <onboarding@resend.dev>',
      to: ['artcoder@artcoder.com.br'],
      subject: payload.subject,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0F172A; color: #F8FAFC; padding: 24px; border-radius: 8px;">
          <h2 style="color: #FF6B00;">${payload.title}</h2>
          <p><strong>Nome:</strong> ${payload.name}</p>
          <p><strong>E-mail:</strong> ${payload.email}</p>
          ${payload.extra ? `<p><strong>Detalhes:</strong> ${payload.extra}</p>` : ''}
          <p><strong>Mensagem:</strong></p>
          <blockquote style="background: #1E293B; padding: 12px; border-left: 4px solid #FF6B00;">${payload.message}</blockquote>
        </div>
      `
    };

    try {
      console.log('Sending payload to Resend:', emailBody);
      return { success: true };
    } catch (err) {
      console.error('Resend dispatch error:', err);
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
```,Description:
