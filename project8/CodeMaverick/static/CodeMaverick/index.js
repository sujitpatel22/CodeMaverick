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

function create_new_team() {
  container = document.createElement('div');
  container.className = "team_action_popup_container new_team_container";
  container.innerHTML = `<form class="new_team_box team_action_box">
                            <strong>Create new Team</strong>
                            <input id="new_team_name" type="text" placeholder="Team name" min = "4" max="24" required>
                            <p>Cannot contain character other than a-z, A-Z, 0-9, _</p>
                            <div>
                                <button type = "submit" class="team_action_btn" id="new_team_create_btn">Create</button>
                                <button type = "button" id="cancel_btn">Cancel</button>
                            </div>
                          </form>`;
  document.getElementById('body').append(container);
  document.querySelector('.new_team_container').style.display = "block";
  var team_name = document.getElementById('new_team_name');
  var new_team_create_btn = document.getElementById('new_team_create_btn');
  new_team_create_btn.setAttribute("disabled", "true");
  team_name.addEventListener("input", function (e) {
    if (team_name.value.length == 0) {
      new_team_create_btn.setAttribute("disabled", "true");
      new_team_create_btn.style.backgroundColor = "darkgray";
    } else {
      new_team_create_btn.removeAttribute("disabled");
      new_team_create_btn.style.backgroundColor = "#96ff96";
    }
  })
  $('.new_team_box').on('submit', function (event) {
    event.preventDefault();
    var notif = $(".new_team_box p");
    notif.innerHTML = "Creating new team...";
    $.ajax({
      url: "new_team",
      type: "POST",
      data: JSON.stringify({
        team_name: document.getElementById('new_team_name').value
      }),
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        notif.innerHTML = success;
        notif.style.color = "green";
        load_teams();
      },
      error: function (xhr, status, error) {
        console.log("Error:", error);
        notif.innerHTML = error;
        notif.style.color = "red";
      }
    });
  });
  document.querySelector('.new_team_box #cancel_btn').addEventListener('click', () => {
    document.querySelector('.new_team_container').remove();
  });
}

function load_teams() {
  $.ajax({
    url: "load_teams",
    type: "GET",
    dataType: "json",
    success: function (data) {
      var all_teams_box = $("#all_teams_list_box");
      all_teams_box.empty();
      console.log(data)
      data["my_teams"].forEach(team => {
        div = document.createElement('div');
        div.className = "team_item";
        div.id = `${team["team_id"]}`;
        div.innerHTML = `<div class="team_item_name team_item_box2">
                                <h2>${team["name"]}</h2>
                                <p>${team["rank"]}</p>
                            </div>
                            <div class="team_item_info team_item_box2">
                                <p>Admin: ${team["admin"]}</p>
                                <p>${team["members_count"]} members</p>
                            </div>
                            <div class="team_item_btns team_item_box2">
                                <button class="team_item_btn btn" id="_team_apply_btn">Apply</button>
                                <button class="team_item_btn btn" id="_team_mark_btn">Mark</button>
                            </div>`;
        all_teams_box.append(div);
        div.addEventListener('click', () => load_team_room(`${team["team_id"]}`));
        // apply_btn = document.querySelector(`${team["team_id"]}_#team_apply_btn`);
        // apply_btn.addEventListener('click', () => {
        //   fetch(`team_apply/${team["team_id"]}`)
        //   apply_btn.innerHTML = "Requested";
        // })
        // document.querySelector(`#${team["id"]} #team_mark_btn`)
      })
      data["teams"].forEach(team => {
        div = document.createElement('div');
        div.className = "team_item";
        div.id = `{team["team_id"]}`;
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
        div.addEventListener('click', () => load_team_room(`${team["team_id"]}`));
      })
    },
    error: function (xhr, status, error) {
      console.log("Error:", error);
    }
  });
}

function load_team_room(team_id) {
  document.querySelector('#show_team_info_btn').addEventListener('click', () => {
    team_info_view(team_id);
  })

  var chatbox = $('#chat_box');

  $.ajax({
    url: `load_team_room/${team_id}`,
    type: "POST",
    dataType: "json",
    success: function (data) {
      console.log(data);
      $('#chat_box').data("data-name", data["room_id"]);
      document.querySelector('.team_info_box_head #team_title').innerHTML = `${data["team"]["name"]}`;
      document.querySelector('.team_rank strong').innerHTML = `Rank: ${data["team"]["rank"]}`;
      document.querySelector('.team_members_count strong').innerHTML = `${data["team"]["members_count"]} members`;
      var members_icons_box = document.querySelector('.team_members_icons_box');
      members_icons_box.innerHTML = "";
      data["team"]["members"].forEach(member => {
        member_card = document.createElement('a');
        member_card.className = "member_icon_card";
        member_card.id = `${member["username"]}`;
        member_card.innerHTML = `<h3>${member["name"]}</h3>
                                  	<h5>${member["username"]}</h5>`;
        members_icons_box.append(member_card);
        member_card.setAttribute("href", `${member["username"]}`);
      })

      data["messages"].forEach(message => {
        download_message(message);
      })
    },
    error: function (xhr, status, error) {
      console.log("Error:", error);
    }
  });

  function download_message(message) {
    container = document.createElement('div');
    if (message["sender_id"] == sessionID) {
      container.className = "right_msg_container_main";
      container.innerHTML = `<div class="right_msg_box msg_box">
            <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13" xml:space="preserve"><path fill="#1f441f" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path></svg>
            <div class="right_quote_msg quote_msg">
            <div class="msg_head">
            <p class="right_msg_user_name msg_user_name">${message["sender_name"]}</p>
            <p class="msg_option_drop">⁝</p>
            </div>
            <p class="msg_text">${message["quote_text"]}</p>
            <p class="msg_time">${message["time"]}</p>
            </div>
            </div>
            <div class="msg_utilities">
            <svg class="reply_msg_icon" value="${message["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve" transform="rotate(180, 0, 0)"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            <svg class="forward_msg_icon" value="${message["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            </div>`;
    }
    else {
      container.className = "left_msg_container_main";
      container.innerHTML = `<div class="left_msg_box msg_box">
            <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class="tail_end_left" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13" xml:space="preserve"><path fill="#242424" d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"></path></svg>
            <div class="left_quote_msg quote_msg">
            <div class="msg_head">
            <p class="left_msg_user_name msg_user_name">${message["sender_name"]}</p>
            <p class="msg_option_drop">⁝</p>
            </div>
            <p class="msg_text">${message["quote_text"]}</p>
            <p class="msg_time">${message["time"]}</p>
            </div>
            </div>
            <div class="msg_utilities">
            <svg class="reply_msg_icon" value="${message["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve" transform="rotate(180, 0, 0)"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            <svg class="forward_msg_icon" value="${message["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            </div>`;
    }
    chatbox.append(container);
  }
}

function team_info_view(team_id) {
  team_info_box_body = document.querySelector('.team_info_box_body');
  if (team_info_box_body.style.display == "none")
    team_info_box_body.style.display = "flex";
  else {
    team_info_box_body.style.display = "none";
    return;
  }
  document.querySelector('#delete_team_btn').addEventListener('click', () => {
    delete_team(team_id);
  });
}


function delete_team(team_id) {
  document.querySelector('.team_info_box_body').style.display = "none";
  var container = document.createElement('div');
  container.className = "team_action_popup_container delete_team_container";
  container.innerHTML = `<form class="delete_team_box team_action_box">
                            <strong>Delete Team</strong>
                            <p>This action cannot be recovered! Deleting a team will delete all the realted data (messages, media files and code snipets, permanently!</p>
                            <p>Type 'Yes' to confirm delete</p>
                            <input id="team_delete_confirmation" type="text" required>
                            <div>
                                <button type = "submit" class="team_action_btn" id="confirm_delete_btn">Delete</button>
                                <button type = "button" id="cancel_btn">Cancel</button>
                            </div>
                          </form>`;
  document.getElementById('body').append(container);
  document.querySelector('.delete_team_container').style.display = "block";
  var confirm_delete_btn = document.querySelector('#confirm_delete_btn');
  confirm_delete_btn.setAttribute("disabled", "true");
  var delete_confirmation = document.querySelector('#team_delete_confirmation');
  delete_confirmation.addEventListener("input", function (e) {
    if (delete_confirmation.value.toLowerCase() != "yes") {
      confirm_delete_btn.setAttribute("disabled", "true");
      confirm_delete_btn.style.backgroundColor = "darkgray";
    } else {
      confirm_delete_btn.removeAttribute("disabled");
      confirm_delete_btn.style.backgroundColor = "#96ff96";
    }
  })
  document.querySelector('.delete_team_box').addEventListener('submit', () => {
    $.ajax({
      url: `delete_team/${team_id}`,
      type: "POST",
      data: JSON.stringify({
        team_name: document.getElementById('team_delete_confirmation').value
      }),
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        console.log(response["success"]);
        load_teams();
      },
      error: function (xhr, status, error) {
        console.log("Error:", error);
      }
    });
  });
  document.querySelector('.delete_team_box #cancel_btn').addEventListener('click', () => {
    document.querySelector('.delete_team_container').remove();
  })
}