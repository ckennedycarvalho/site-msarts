// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Cookie Banner Logic (LGPD)
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-cookies');

if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookieBanner.classList.add('active');
    }, 2000);
}

acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.remove('active');
});

// Form Submission (Simulated for now, can be connected to Supabase)
const quoteForm = document.getElementById('quote-form');

quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        project: document.getElementById('project').value,
        message: document.getElementById('message').value,
        _honeypot: document.querySelector('input[name="_honeypot"]').value
    };


    // Real API Call to Node.js backend
    const submitBtn = quoteForm.querySelector('button');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = 'Enviando...';
    submitBtn.disabled = true;

    fetch('/api/orcamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                submitBtn.innerText = 'Solicitação Enviada!';
                submitBtn.style.background = '#4CAF50';
                quoteForm.reset();
            } else {
                submitBtn.innerText = 'Erro ao enviar';
                submitBtn.style.background = '#f44336';
            }

            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.innerText = 'Erro de Conexão';
            submitBtn.style.background = '#f44336';

            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
});

// Smooth Scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
