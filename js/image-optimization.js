// Optimización de imágenes con lazy loading y soporte WebP
class ImageOptimizer {
    constructor() {
        this.webpSupported = this.checkWebPSupport();
        this.images = [];
        this.init();
    }

    // Verificar soporte de WebP
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupIntersectionObserver();
    }

    // Configurar lazy loading para imágenes
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.images.push(img);
            img.classList.add('lazy-image');
            img.classList.add('image-placeholder');
        });
    }

    // Optimizar imágenes existentes
    optimizeExistingImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            this.optimizeImage(img);
        });
    }

    // Optimizar imagen individual
    optimizeImage(img) {
        if (this.webpSupported && img.src.includes('.jpeg')) {
            const webpSrc = img.src.replace('.jpeg', '.webp');
            img.src = webpSrc;
        } else if (this.webpSupported && img.src.includes('.png')) {
            const webpSrc = img.src.replace('.png', '.webp');
            img.src = webpSrc;
        }

        // Agregar clase para animación de carga
        img.classList.add('lazy-image');
        
        img.addEventListener('load', () => {
            img.classList.remove('image-placeholder');
            img.classList.add('loaded');
        });

        img.addEventListener('error', () => {
            console.warn('Error cargando imagen:', img.src);
            // Intentar con formato original si WebP falla
            if (img.src.includes('.webp')) {
                const originalSrc = img.src.replace('.webp', img.src.includes('.jpeg') ? '.jpeg' : '.png');
                img.src = originalSrc;
            }
        });
    }

    // Configurar Intersection Observer para lazy loading
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores sin Intersection Observer
            this.loadAllImages();
        }
    }

    // Cargar imagen individual
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Optimizar URL para WebP si es soportado
        let optimizedSrc = src;
        if (this.webpSupported) {
            if (src.includes('.jpeg')) {
                optimizedSrc = src.replace('.jpeg', '.webp');
            } else if (src.includes('.png')) {
                optimizedSrc = src.replace('.png', '.webp');
            }
        }

        img.src = optimizedSrc;
        img.removeAttribute('data-src');
    }

    // Cargar todas las imágenes (fallback)
    loadAllImages() {
        this.images.forEach(img => {
            this.loadImage(img);
        });
    }

    // Precargar imágenes críticas
    preloadCriticalImages() {
        const criticalImages = [
            'assets/img/profile-picture/profile.webp',
            'assets/img/profile/1.webp',
            'assets/img/profile/4.webp'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Inicializar optimizador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const imageOptimizer = new ImageOptimizer();
    imageOptimizer.preloadCriticalImages();
});

// Optimizar imágenes dinámicamente agregadas
const originalAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(child) {
    const result = originalAppendChild.call(this, child);
    if (child.tagName === 'IMG') {
        const imageOptimizer = window.imageOptimizer;
        if (imageOptimizer) {
            imageOptimizer.optimizeImage(child);
        }
    }
    return result;
};
