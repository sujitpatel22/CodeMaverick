document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('teams_btn').addEventListener('click', () => load_teams());
  document.querySelector('#new_team_btn').addEventListener('click', () => create_new_team());

  // const navLinks = document.querySelectorAll('nav a');
  // navLinks.forEach(link => {
  //   link.addEventListener('click', function (event) {
  //     event.preventDefault();
  //     navLinks.forEach(link => {
  //       link.style.borderBottom = "none";
  //       link.style.backgroundColor = "";
  //       link.style.color = "black";
  //     });
  //     this.style.borderBottom = "2px solid orange";
  //     this.style.backgroundColor = "black";
  //     this.style.color = "white";
  //   });


  const profile_links = document.querySelectorAll('.profile_nav_btn');
  profile_links.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      profile_links.forEach(link => {
        link.style.backgroundColor = "#fff2e7";
      });
      this.style.backgroundColor = "#fce6d3";
      load_profile_info(link.value());
    });
  });

});

function load_profile_info(info) {
  info_body = document.querySelector('.body_content');
  info_body.innerHTML = "";
  fetch(`/profile/${info}`)
    .then(response => response.json())
    .then(about => {
      document.querySelector('.head_title strong').innerText = "About";
      info_body.innerText = about;
    })
    .then(skills => {
      document.querySelector('.head_title strong').innerText = "Skills";
      skills.forEach(skill => {
        div = document.createElement('div');
        div.className = "skill_item";
        div.className += "profile_info_item";
        div.append(skill);

        info_body.append(div);
      })
    })
    .then(certifications => {
      document.querySelector('.head_title strong').innerText = "Certifications";
      certifications.forEach(certificate => {
        div = document.createElement('div');
        div.className = "certificate_item";
        div.className += "profile_info_item";
        strong = document.createElement('strong');
        strong.innerText = certificate["title"];
        div.append(strong);
        cer_src = document.createElement('p');
        cer_src.innerText = certificate["src"];
        div.append(cer_src);
        cer_id = document.createElement('p');
        cer_id.innerText = certificate["id"];
        div.append(cer_id);
        cer_issue_date = document.createElement('p');
        cer_issue_date.innerText = certificate["issue_date"];
        div.append(cer_issue_date);

        info_body.append(div);
      })
    })
    .then(projects => {
      document.querySelector('.head_title strong').innerText = "Certifications";
      projects.forEach(project => {
        div = document.createElement('div');
        div.className = "project_item";
        div.className += "profile_info_item";
        strong = document.createElement('strong');
        strong.innerText = certificate["title"];
        div.append(strong);
        final_date = document.createElement('p');
        final_date.innerText = certificate["final_date"];
        div.append(final_date);

        info_body.append(div);
      })
    })
}

function load_teams() {
  window.onload = function () {
    all_teams_box = document.getElementById('all_teams_list_box');
    all_teams_box.innerHTML = "";
    fetch('load_teams')
      .then(response => response.json())
      .then(response => {
        console.log(response)
        //   response["my_teams"].forEach(team => {
        //     div = document.createElement('div');
        //     div.className = "team_item";
        //     const randID = Math.random().toString(36).substring(2, 10);
        //     div.id = `${randID}${team["id"]}`;
        //     div.innerHTML = `<div class="team_item_name team_item_box2">
        //                           <h2>${team["name"]}</h2>
        //                           <p>${team["rank"]}</p>
        //                       </div>
        //                       <div class="team_item_info team_item_box2">
        //                           <p>Admin: ${team["admin"]}</p>
        //                           <p>${team["members"]} members</p>
        //                       </div>
        //                       <div class="team_item_btns team_item_box2">
        //                           <button class="team_item_btn btn" id="team_apply_btn">Apply</button>
        //                           <button class="team_item_btn btn" id="team_mark_btn">Mark</button>
        //                       </div>`;
        //     all_teams_box.append(div);
        //     apply_btn = document.querySelector(`#${randID}${team["id"]} #team_apply_btn`);
        //     apply_btn.addEventListener('click', () => {
        //       fetch(`team_apply/${team["id"]}`)
        //       apply_btn.innerHTML = "Requested";
        //     })
        //     // document.querySelector(`#${team["id"]} #team_mark_btn`)
        //   })
      })
      .catch(error => {
        console.log(error);
      })
  }
}

function create_new_team() {
  document.querySelector('.new_team_container').style.display = "block";
  team_name = document.getElementById('new_team_name');
  new_team_create_btn = document.querySelector('#new_team_create_btn');
  team_name.addEventListener("input", function (e) {
    if (team_name.value.length == 0) {
      new_team_create_btn.setAttribute("disabled", "true");
      new_team_create_btn.style.color = "darkgray";
    } else {
      new_team_create_btn.setAttribute("disabled", "false");
      new_team_create_btn.style.color = "#004000";
    }
  })
  new_team_create_btn.addEventListener('click', () => {
    notif = document.querySelector('.new_team_box p');
    notif.innerHTML = "Creating new team...";
    fetch('new_team', {
      method: "POST",
      body: JSON.stringify({
        data: document.getElementById('new_team_name').value
      })
    })
      .then(response => response.json())
      .then(success => {
        notif.innerHTML = success;
        notif.style.color = "green";
        load_teams();
      })
      .catch(error => {
        notif.innerHTML = error;
        notif.style.color = "red";
      })
  });
  document.querySelector('#cancel_btn').addEventListener('click', () => {
    document.querySelector('.new_team_container').style.display = "none";
  });
}