const toggleElements = document.querySelectorAll('.toggle');

toggleElements.forEach(el => {
    el.innerHTML = `<svg viewBox="0 0 100 100" class="triangle close"><polygon points="5.9,88.2 50,11.8 94.1,88.2 "></polygon></svg>`;
});

const animation = document.querySelectorAll('.triangle');

animation.forEach(el => {
    el.addEventListener('click', () => {
        el.classList.toggle('open');
        el.classList.toggle('close');
        let inner = el.parentNode.parentNode.parentNode.lastElementChild;
        inner.classList.toggle('hidden');
        inner.classList.toggle('showed');
    });
});

if (document.location.pathname !== '/herzen-portfolio/') document.querySelectorAll('a').forEach(el => el.target = '_blank');