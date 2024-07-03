document.addEventListener('DOMContentLoaded', () => {
    //por defecto el modo dia
    
    const modeSwitch = document.getElementById('modeSwitch');
    const slider = document.getElementById('slider');
    const cards = document.querySelectorAll('.card');
    const body = document.body;
    const img = document.querySelector('.profile-pic');

    modeSwitch.style.display = 'none';

    const toggleMode = () => {
        const isLightMode = body.classList.toggle('light-mode');
        slider.style.display = 'block';
        // console.log(isLightMode ? 'Modo día activado' : 'Modo noche activado');

        img.src = isLightMode ? './assets/img/profile/1.png' : './assets/img/profile/4.png';


        cards.forEach(card => {
            card.classList.toggle('bg-dark', !isLightMode);
            card.classList.toggle('bg-white', isLightMode);
            card.classList.toggle('text-dark', isLightMode);
            card.classList.toggle('text-white', !isLightMode);
        });
    };

    modeSwitch.addEventListener('change', toggleMode);

    if (modeSwitch.checked) {
        toggleMode();
    }
});