$(function () {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    roomID = $('#chatbox').data('name');
    console.log(roomID);
    const chatSocket = new WebSocket(
        `${ws_scheme}://window.location.host/ws/chat/${roomID}/user_id=${sessionID}`
    );

    var chatbox = $('#chat_box');
    $("#chatform").on("submit", function (event) {
        event.preventDefault();
        var textinput = $('#msg_text').val();
        var message = {
            sender: currentUserId,
            quote_text: textinput
        }
        chatSocket.send(JSON.stringify(message));
        return true;
    });

    chatSocket.onmessage = function (message) {
        var data = JSON.parse(message.data);

        container = document.createElement('div');
        if (data["send_id"] == sessionID) {
            container.className = "right_msg_container_main";
            container.innerHTML = `<div class="right_msg_box msg_box">
            <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13" xml:space="preserve"><path fill="#1f441f" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path></svg>
            <div class="right_quote_msg quote_msg">
            <div class="msg_head">
            <p class="right_msg_user_name msg_user_name">${data["sender_name"]}</p>
            <p class="msg_option_drop">⁝</p>
            </div>
            <p class="msg_text">${textinput}</p>
            <p class="msg_time">${getCurrentRealTime()}</p>
            </div>
            </div>
            <div class="msg_utilities">
            <svg class="reply_msg_icon" value="${data["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve" transform="rotate(180, 0, 0)"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            <svg class="forward_msg_icon" value="${data["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            </div>`;
        }
        else {
            container.className = "left_msg_container_main";
            container.innerHTML = `<div class="left_msg_box msg_box">
            <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class="tail_end_left" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13" xml:space="preserve"><path fill="#242424" d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"></path></svg>
            <div class="left_quote_msg quote_msg">
            <div class="msg_head">
            <p class="left_msg_user_name msg_user_name">${data["sender_name"]}</p>
            <p class="msg_option_drop">⁝</p>
            </div>
            <p class="msg_text">${data["quote_text"]}</p>
            <p class="msg_time">${data["time"]}</p>
            </div>
            </div>
            <div class="msg_utilities">
            <svg class="reply_msg_icon" value="${data["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve" transform="rotate(180, 0, 0)"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            <svg class="forward_msg_icon" value="${data["msg_id"]}" viewBox="0 0 25 25" height="25" width="25" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 25 25" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="darkgray" d="M14.248,6.973c0-0.614,0.741-0.921,1.174-0.488l5.131,5.136 c0.269,0.269,0.269,0.704,0,0.973l-5.131,5.136c-0.433,0.433-1.174,0.126-1.174-0.488v-2.319c-4.326,0-7.495,1.235-9.85,3.914 c-0.209,0.237-0.596,0.036-0.511-0.268c1.215-4.391,4.181-8.492,10.361-9.376V6.973z"></path></svg>
            </div>`;
        }
        chatbox.append(container);
    };

    function getCurrentRealTime() {
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const currentTime = `${formattedHours}:${formattedMinutes}`;
        return currentTime;
    }
});

function download_message() {

}