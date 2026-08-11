# Artcoder Sistemas e Tecnologia — Landing Page & Compliance

Site institucional e landing page corporativa da **Artcoder Sistemas e Tecnologia**, desenvolvido para apresentação de soluções digitais de alta performance e atendimento integral aos requisitos legais das lojas **Google Play Store**, **Apple App Store Connect** e regulamentação da **LGPD**.

---

## 🚀 Sobre o Projeto

O site tem dois objetivos principais:

1. **Presença Institucional & Portfólio:** Apresentar a Artcoder como especialistas em engenharia de software, arquitetura cloud, microsserviços e desenvolvimento mobile, destacando o aplicativo **AirsoftHub** (`airsofthub.app`).
2. **Conformidade Legal para Publicação de Apps:** Disponibilizar endpoints web públicos e estáticos com URLs próprias para Política de Privacidade, Termos de Uso e Formulário de Solicitação de Exclusão de Conta e Dados Pessoais (exigência indispensável para aprovação de aplicativos iOS e Android).

---

## 🎨 Design System

O projeto utiliza um visual **Dark Mode moderno com destaques em Laranja**, projetado em CSS3 Vanilla responsivo com efeitos de *glassmorphism* e micro-animações:

* **Fundo Principal (`--bg-main`):** `#0F172A` (Slate Dark / Grafite Escuro)
* **Cards / Containers (`--bg-card`):** `#1E293B` (Grafite Médio)
* **Laranja Principal (`--primary-orange`):** `#FF6B00` (Ações e destaques)
* **Laranja Secundário (`--secondary-orange`):** `#FFA048` (Hover e detalhes)
* **Texto Principal (`--text-primary`):** `#F8FAFC` (Branco Gelo)
* **Texto Secundário (`--text-secondary`):** `#94A3B8` (Cinza Claro)
* **Tipografia:** Google Fonts (*Sora*, *Outfit*, *Inter*)

---

## 📁 Estrutura de Arquivos

```
artcoder-lp/
├── index.html              # Landing Page principal (Hero, Sobre, Produtos, Suporte, Footer)
├── privacidade.html        # Política de Privacidade (LGPD & App Store compliant)
├── termos.html            # Termos de Uso
├── exclusao-de-conta.html  # Canal interativo de solicitação de exclusão de conta e dados
├── README.md               # Documentação explicativa do projeto
├── assets/
│   ├── css/
│   │   └── style.css       # Design System, layout, responsividade e animações
│   ├── js/
│   │   └── main.js         # Interatividade client-side, menu responsivo e integração Resend
│   └── images/
│       ├── logo.svg        # Logotipo vetorial oficial
│       ├── isoelogo.svg    # Logotipo completo oficial
│       └── airsofthub-icon.svg # Ícone do app AirsoftHub
└── docs/
    └── superpowers/        # Especificações técnicas e planos de implementação
```

---

## ⚖️ Links Legais Obrigatorios para Lojas (App Store & Google Play)

Ao cadastrar os aplicativos no **Google Play Console** e **App Store Connect**, utilize as URLs públicas correspondentes:

* **Política de Privacidade:** `https://artcoder.com.br/privacidade.html`
* **Termos de Uso:** `https://artcoder.com.br/termos.html`
* **Exclusão de Conta e Dados:** `https://artcoder.com.br/exclusao-de-conta.html`
* **E-mail Oficial de Suporte:** `artcoder@artcoder.com.br`

---

## 🛠️ Execução Local

Como o projeto é construído em **HTML5, CSS3 e JS Vanilla**, você pode executá-lo diretamente sem necessidade de compilação:

### Opção 1: Usando o comando `npx serve`
```bash
npx serve .
```

### Opção 2: Usando Python HTTP Server
```bash
python3 -m http.server 8000
```
Acesse `http://localhost:8000` no seu navegador.

---

## ✉️ Integração com Resend (Envio de Formulários)

Os formulários de **Suporte** (`index.html`) e **Exclusão de Conta** (`exclusao-de-conta.html`) utilizam o serviço **Resend** para envio de notificações por e-mail para `artcoder@artcoder.com.br`.

### Arquitetura de Produção Recomendada (Vercel / Serverless)

Para manter a `RESEND_API_KEY` em segurança sem expô-la no navegador:

1. Crie o endpoint Serverless em `api/send.js`:
   ```javascript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);

   export default async function handler(req, res) {
     if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
     const { title, subject, name, email, extra, message } = req.body;

     try {
       const data = await resend.emails.send({
         from: 'Artcoder Web <contato@artcoder.com.br>',
         to: ['artcoder@artcoder.com.br'],
         subject: subject,
         html: `<h2>${title}</h2><p><strong>Nome:</strong> ${name}</p><p><strong>E-mail:</strong> ${email}</p><p>${message}</p>`
       });
       return res.status(200).json({ success: true, data });
     } catch (error) {
       return res.status(500).json({ error: error.message });
     }
   }
   ```
2. Adicione a variável `RESEND_API_KEY` nas configurações da sua plataforma de hospedagem (Vercel/Netlify).

---

## 🏢 Dados Institucionais

* **Empresa:** ARTCODER SISTEMAS E TECNOLOGIA
* **Localização:** Curitiba - PR, Brasil
* **E-mail:** `artcoder@artcoder.com.br`
* **Website:** [artcoder.com.br](https://artcoder.com.br)
* **Copyright:** © 2026 Artcoder Sistemas e Tecnologia. Todos os direitos reservados.
