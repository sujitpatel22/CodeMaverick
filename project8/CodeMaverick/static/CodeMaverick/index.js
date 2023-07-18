document.addEventListener('DOMContentLoaded', function() {
    // document.querySelector('.login_btn').addEventListener('click', () => login());

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();

        navLinks.forEach(link => {
          link.style.borderBottom = "none";
        });
        this.style.borderBottom = "10% solid black";
      });
    });

});

function login() {
    login_view = document.querySelector('#login_view');
    register_view = document.querySelector('#register_view');
    if (login_view.style.display == "none") {
        login_view.style.display = "flex";
        register_view.style.display = "none";
    }
    else {
        login_view.style.display = "none";
        register_view.style.display = "flex";
    }
}