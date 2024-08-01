document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');

    menuToggle.addEventListener('change', function () {
        if (this.checked) {
            navbar.classList.add('open');
        } else {
            navbar.classList.remove('open');
        }
    });
});
