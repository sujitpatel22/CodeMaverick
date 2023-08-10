document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("teams_btn").addEventListener("click", () => load_teams(), load_messages());
  document.querySelector("#new_team_btn").addEventListener("click", () => create_new_team());
  document.querySelector("#chat_send_btn").addEventListener("click", (e) => {
    if (e.length != 0 ){ 
      send_message(e);}
    })

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
  // });

  const profile_links = document.querySelectorAll(".profile_nav_btn");
  profile_links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      profile_links.forEach((link) => {
        link.style.backgroundColor = "#fff2e7";
      });
      this.style.backgroundColor = "#fce6d3";
      load_profile_info(link.value());
    });
  });

  // Input prompt grow in size as user input
  const inputField = document.getElementById("chat_message_input");
  inputField.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});

function load_profile_info(info) {
  info_body = document.querySelector(".body_content");
  info_body.innerHTML = "";
  fetch(`/profile/${info}`)
    .then((response) => response.json())
    .then((about) => {
      document.querySelector(".head_title strong").innerText = "About";
      info_body.innerText = about;
    })
    .then((skills) => {
      document.querySelector(".head_title strong").innerText = "Skills";
      skills.forEach((skill) => {
        div = document.createElement("div");
        div.className = "skill_item";
        div.className += "profile_info_item";
        div.append(skill);

        info_body.append(div);
      });
    })
    .then((certifications) => {
      document.querySelector(".head_title strong").innerText = "Certifications";
      certifications.forEach((certificate) => {
        div = document.createElement("div");
        div.className = "certificate_item";
        div.className += "profile_info_item";
        strong = document.createElement("strong");
        strong.innerText = certificate["title"];
        div.append(strong);
        cer_src = document.createElement("p");
        cer_src.innerText = certificate["src"];
        div.append(cer_src);
        cer_id = document.createElement("p");
        cer_id.innerText = certificate["id"];
        div.append(cer_id);
        cer_issue_date = document.createElement("p");
        cer_issue_date.innerText = certificate["issue_date"];
        div.append(cer_issue_date);

        info_body.append(div);
      });
    })
    .then((projects) => {
      document.querySelector(".head_title strong").innerText = "Certifications";
      projects.forEach((project) => {
        div = document.createElement("div");
        div.className = "project_item";
        div.className += "profile_info_item";
        strong = document.createElement("strong");
        strong.innerText = certificate["title"];
        div.append(strong);
        final_date = document.createElement("p");
        final_date.innerText = certificate["final_date"];
        div.append(final_date);

        info_body.append(div);
      });
    });
}

function load_teams() {
  // removed windpws load function
  all_teams_box = document.getElementById("all_teams_list_box");
  all_teams_box.innerHTML = "";
  fetch("load_teams")
    .then((response) => response.json())
    .then((response) => {
      response["my_teams"].forEach((team) => {
        div = document.createElement("div");
        div.className = "team_item";
        const randID = Math.random().toString(36).substring(2, 10);
        div.id = `${randID}${team["id"]}`;
        div.innerHTML = `<div class="team_item_name team_item_box2">
                                  <h2>${team["name"]}</h2>
                                  <p>${team["rank"]}</p>
                              </div>
                              <div class="team_item_info team_item_box2">
                                  <p>Admin: ${team["admin"]}</p>
                                  <p>${team["members"]} members</p>
                              </div>
                              <div class="team_item_btns team_item_box2">
                                  <button class="team_item_btn btn" id="team_apply_btn">Apply</button>
                                  <button class="team_item_btn btn" id="team_mark_btn">Mark</button>
                              </div>`;
        all_teams_box.append(div);
        // apply_btn = document.querySelector(`#${randID}${team["id"]} #team_apply_btn`);
        // apply_btn.addEventListener('click', () => {
        //   fetch(`team_apply/${team["id"]}`)
        //   apply_btn.innerHTML = "Requested";
        // })
        // document.querySelector(`#${team["id"]} #team_mark_btn`)
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function create_new_team() {
  document.querySelector(".new_team_container").style.display = "block";
  team_name = document.getElementById("new_team_name");
  new_team_create_btn = document.querySelector("#new_team_create_btn");
  // team_name.addEventListener("input", function (e) {
  //   if (team_name.value.length == 0) {
  //     new_team_create_btn.setAttribute("disabled", "true");
  //     new_team_create_btn.style.color = "darkgray";
  //   } else {
  //     new_team_create_btn.setAttribute("disabled", "false");
  //     new_team_create_btn.style.color = "#004000";
  //   }
  // })
  new_team_create_btn.addEventListener("click", (event) => {
    event.preventDefault();
    notif = document.querySelector(".new_team_box p");
    notif.innerHTML = "Creating new team...";
    fetch("new_team", {
      method: "POST",
      body: JSON.stringify({
        data: document.getElementById("new_team_name").value,
      }),
    })
      .then((response) => response.json())
      .then((success) => {
        notif.innerHTML = success["success"];
        notif.style.color = "green";
        load_teams();
      })
      .catch((error) => {
        notif.innerHTML = error;
        notif.style.color = "red";
      });
    window.location.reload();
  });
  document.querySelector("#cancel_btn").addEventListener("click", () => {
    document.querySelector(".new_team_container").style.display = "none";
  });
}

// funciton  send message added
function send_message(e) {
  content = document.getElementById("chat_message_input");
  e.preventDefault();
  fetch("message", {
    method: "POST",
    body: JSON.stringify({
      message: content.value,
    }),
  })
    .then((response) => response.json())
    .then((sent) => {
      content.value = ""
      window.location.reload();
      load_messages();
    })
    .catch((error) => {
      console.log(error);
    });
}

function load_messages() {
  chat_container = document.querySelector(".chat_content");
  fetch("message")
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      response["messages"].forEach((element) => {
        var direction;
        if (element.sender == response["user"]){
          direction = "right";
        }
        else {
          direction = "left"
        }
        div = document.createElement("div");
        div.className = `${direction}_msg_box msg_box`;
        div.innerHTML = `
            <div class="${direction}_msg_box msg_box">
                        <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class=""
                            version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13" xml:space="preserve">
                            <path fill="#1f441f" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path>
                        </svg>
                        <div class="${direction}_quote_msg quote_msg">
                            <div class="msg_head">
                                <p class="${direction}_msg_user_name msg_user_name">${element.sender}</p>
                                <p class="msg_option_drop">⁝</p>
                            </div>
                            <p class="msg_text">${element.content}</p>
                            <p class="msg_time">${element.time}</p>
                        </div>
                    </div>
                    <div class="msg_utilities">
                        <svg class="reply_msg_icon" viewBox="0 0 25 25" height="25" width="25"
                            preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px"
                            enable-background="new 0 0 25 25" xml:space="preserve" transform="rotate(180, 0, 0)">
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray"
                                d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z">
                            </path>
                        </svg>
                        <svg class="forward_msg_icon" viewBox="0 0 25 25" height="25" width="25"
                            preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px"
                            enable-background="new 0 0 25 25" xml:space="preserve">
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray"
                                d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z">
                            </path>
                        </svg>
                    </div>
                </div>`;
        chat_container.append(div);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
