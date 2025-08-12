document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const modeSwitch = document.getElementById('modeSwitch');
    const slider = document.getElementById('slider');
    const body = document.body;
    const heroImage = document.querySelector('.hero-image');
    const navProfilePic = document.querySelector('.nav-profile-pic');

    // Función para cambiar el modo
    const toggleMode = () => {
        const isLightMode = body.classList.toggle('light-mode');

            // Cambiar imagen de perfil según el modo
    if (heroImage) {
        const imagePath = 'assets/img/profile-picture/profile.webp';
        heroImage.src = imagePath;
        console.log('Cargando imagen:', imagePath);
    }
            if (navProfilePic) {
        const navImagePath = isLightMode ? 'assets/img/profile/1.webp' : 'assets/img/profile/4.webp';
        navProfilePic.src = navImagePath;
    }

        // Guardar preferencia en localStorage
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    };

    // Event listener para el switch
    modeSwitch.addEventListener('change', toggleMode);

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        modeSwitch.checked = true;
        toggleMode();
    }

    // Navegación suave para enlaces internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para navbar fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navegación activa en scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Animación de aparición para cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar cards para animación
    const cards = document.querySelectorAll('.blog-card, .project-card, .resource-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Verificar carga de imagen de perfil
    const profileImage = document.querySelector('.hero-image');
    if (profileImage) {
        profileImage.addEventListener('load', () => {
            console.log('Imagen de perfil cargada correctamente');
        });
        
        profileImage.addEventListener('error', () => {
            console.error('Error cargando imagen de perfil');
            // Intentar con la imagen alternativa
            profileImage.src = 'assets/img/profile/4.webp';
        });
    }

    // Navbar transparente en hero section
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Tooltip para botones de contacto
    const contactButtons = document.querySelectorAll('.contact-buttons .btn');
    contactButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animación de escritura para el título principal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        };
        
        // Iniciar animación después de un pequeño delay
        setTimeout(typeWriter, 500);
    }

    // Protección de imagen contra descarga
    const protectedImages = document.querySelectorAll('.protected-image');
    
    // Deshabilitar clic derecho en imágenes protegidas
    protectedImages.forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showProtectionMessage('Clic derecho deshabilitado');
        });
        
        // Deshabilitar arrastrar imagen
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            showProtectionMessage('Arrastre deshabilitado');
        });
        
        // Deshabilitar selección de imagen
        img.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    });

    // Deshabilitar clic derecho en toda la página para mayor protección
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.protected-image-container')) {
            e.preventDefault();
            // showProtectionMessage('Imagen protegida');
        }
    });

    // Deshabilitar teclas de acceso rápido para guardar
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            showProtectionMessage('Guardar deshabilitado');
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
            if (document.activeElement.closest('.protected-image-container')) {
                e.preventDefault();
                showProtectionMessage('Copia deshabilitada');
            }
        }
    });

    // Función para mostrar mensaje de protección
    function showProtectionMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'protection-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // Agregar estilos de animación para las notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Funcionalidad para compartir por WhatsApp
    const shareWhatsAppBtn = document.getElementById('shareWhatsApp');
    if (shareWhatsAppBtn) {
        shareWhatsAppBtn.addEventListener('click', () => {
            const currentUrl = window.location.href;
            const title = document.title || 'Artículo de EnriqueXL';
            const message = `¡Mira este artículo interesante: ${title}\n\n${currentUrl}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            
            // Abrir WhatsApp en una nueva ventana
            window.open(whatsappUrl, '_blank', 'width=600,height=400');
        });
    }
});