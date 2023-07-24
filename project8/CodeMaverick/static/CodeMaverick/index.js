document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('#switch_login_btn').addEventListener('click', () => auth("register_view"));
    document.getElementById('#switch_register_btn').addEventListener('click', () => auth("login_view"));
    document.getElementById('#teams_btn').addEventListener('click', () => load_teams());

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        navLinks.forEach(link => {
          link.style.borderBottom = "none";
          link.style.backgroundColor = "";
          link.style.color = "black";
        });
        this.style.borderBottom = "2px solid orange";
        this.style.backgroundColor = "black";
        this.style.color = "white";

      });
    });

});

function auth(view) {
    login_view = document.querySelector('#login_view');
    register_view = document.querySelector('#register_view');
    if (view == "login_view") {
        login_view.style.display = "flex";
        register_view.style.display = "none";
    }
    else {
        login_view.style.display = "none";
        register_view.style.display = "flex";
    }
}

function load_teams()
{
  // fetch('/load_teams')
  // .then(response => response.json())
  // .then(teams => {
  //     teams.forEach(team_info => {

  //     })
  // })
}