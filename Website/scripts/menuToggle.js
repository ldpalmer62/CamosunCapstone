// Wait for the entire HTML document to be fully loaded and parsed before executing the code
document.addEventListener('DOMContentLoaded', function () {
    
    // Get the element with the ID 'menu-toggle'
    const menuToggle = document.getElementById('menu-toggle');
    // Get the element with the ID 'navbar' (navigation menu)
    const navbar = document.getElementById('navbar');

    // Add an event listener to the 'menu-toggle' element that listens for changes
    menuToggle.addEventListener('change', function () {
        
        // If the 'menu-toggle' element is checked, add the 'open' class to the 'navbar' element
        if (this.checked) {
            navbar.classList.add('open');
        } 
        // If the 'menu-toggle' element is unchecked, remove the 'open' class from the 'navbar' element
        else {
            navbar.classList.remove('open');
        }
    });
});

