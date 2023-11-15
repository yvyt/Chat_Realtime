var socket = io("http://localhost:3000/")
$(document).ready(function() {

    $.ajax({
        url: "/user/getOnline",
        type: "get",

        success: function(response) {
            socket.emit("client-login", response)

        },
        error: function(error) {
            alert(error.message)
        }
    })


})
socket.on("user-online", (data) => {
    var users = document.getElementById("current").value
    const usersData = data['users']
    const unseenData = data['unseen']
    let html = "";
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i]["_id"] != users) {
            html += `<li class="active" onclick="showMessenger('${usersData[i]['_id']}')">
                                        <input type="hidden" value="${usersData[i]['_id']}" name="id_contact"/>
        								<div class="d-flex bd-highlight">
        									<div class="img_cont">
        										<img src="images/${usersData[i]['avatar']}" class="rounded-circle user_img">
        										<span class="online_icon"></span>
        									</div>
        									<div class="user_info">
        										<span >${usersData[i]['username']}</span>
        										<p>Online</p>

    									</div>
                                        <p class="unseen_icon" id="unseen_${usersData[i]['_id']}">${countUnseen(unseenData,usersData[i]["_id"])}</p>
    								</div>
    							</li>`
        }
    }
    document.getElementById("listOnline").innerHTML = html
})

function countUnseen(unseenData, id) {
    let count = 0;
    for (let i = 0; i < unseenData.length; i++) {
        if (unseenData[i]['userSend'] === id) {
            count += 1;
        }
    }
    return count
}

function showMessenger(id) {
    var content = document.getElementById("detailMess")
    var users = document.getElementById("current").value
    content.style.display = "block"
    document.getElementById("userContact").value = id
    $.ajax({
        url: "/chat/getDetail",
        type: "post",
        data: {
            id: id
        },
        success: function(response) {
            socket.emit("readMessage", id)
            console.log(response)
            const message = response['message']
            const contact = response['users']
            var imgElement = document.getElementById("contactAvt");
            var currAvt = document.getElementById("currenAvt").src
            imgElement.setAttribute("src", "images/" + contact['avatar']);
            document.getElementById("nameUserContact").innerText = contact['username']
            document.getElementById("profile").href = "/profile/" + contact['_id']
            let html = `<div id="mess_${contact['_id']}">`;
            for (let i = 0; i < message.length; i++) {
                var dateString = message[i]['time']
                var date = new Date(dateString);
                var formattedDate = date.toLocaleDateString();
                var formattedTime = date.toLocaleTimeString();
                if (message[i]['userSend'] === id) {
                    html += `<div class="d-flex justify-content-start mb-4" id='${message[i]['_id']}'>
                					<div class="img_cont_msg">
                						<img src="/images/${contact['avatar']}" class="rounded-circle user_img_msg">
                					</div>
                					<div class="msg_cotainer" style="display: inline-block;height: auto;  word-wrap: break-word;">
                						${message[i]['content']}
                						<span class="msg_time">${formattedDate+' '+formattedTime}</span>
                					</div>
                				</div>`
                } else
                if (message[i]['userSend'] === users) {
                    html += `<div class="d-flex justify-content-end mb-4"  ondblclick=remove('${message[i]['_id']}') id='${message[i]['_id']}'>
                					<div class="msg_cotainer_send" style="display: inline-block;height: auto;  word-wrap: break-word;">
                						${message[i]['content']}
                						<span class="msg_time">${formattedDate+' '+formattedTime}</span>
                					</div>
                					<div class="img_cont_msg">
                				<img src="${currAvt}" class="rounded-circle user_img_msg">
                					</div>
                				</div>`
                }
            }
            html += `<div id=${id}></div></div>`
            document.getElementById("display").innerHTML = html

        },
        error: function(error) {
            alert(error.message)
        }
    })
}
socket.on("read-success", (data) => {
    $.ajax({
        url: "/chat/readMessenger",
        type: "post",
        data: {
            id: data
        },
        success: function(response) {
            if (response.code == 1) {
                socket.emit("update-read", data)
            }
        },
        error: function(error) {
            alert(error.message)
        }
    })

})

function send() {
    var userReceive = document.getElementById("userContact").value
    var content = document.getElementById("content").value
    var users = document.getElementById("current").value
    document.getElementById("content").value = ""
    $.ajax({
        url: "/chat/send",
        type: "post",
        data: {
            userReceive: userReceive,
            content: content
        },
        success: function(response) {
            document.getElementById(userReceive).remove()
            socket.emit("send-success", { us: users, content: content, contact: userReceive, id: response.code })
            socket.emit("update-unseen", userReceive)

        },
        error: function(error) {
            alert(error.message)
        }
    })
}
socket.on("show-mess", (data) => {
    var userReceive = document.getElementById("userContact").value
    var users = document.getElementById("current").value
    let html = document.getElementById("display").innerHTML
    var userTyping = document.getElementById("currentUser").textContent
    socket.emit("user-stop-typing", { id: users, us: userTyping, contact: userReceive })
    var avtCurr = document.getElementById("currenAvt").src
    var avtCont = document.getElementById("contactAvt").src
    var date = new Date();
    var formattedDate = date.toLocaleDateString();
    var formattedTime = date.toLocaleTimeString();
    if (data.us == users && data.contact === userReceive || data.us === userReceive && data.contact === users) {
        if (data.us == users) {
            html += `<div class="d-flex justify-content-end mb-4" ondblclick=remove('${data.id}' id='${data.id}')>
        								<div class="msg_cotainer_send" style="display: inline-block;height: auto;  word-wrap: break-word;">
        									${data.content}
        									<span class="msg_time_send">${formattedDate+" "+formattedTime}</span>
        								</div>
        								<div class="img_cont_msg">
        							<img src="${avtCurr}" class="rounded-circle user_img_msg">
        								</div>
        							</div>`
        } else {
            html += `<div class="d-flex justify-content-start mb-4" id='${data.id}'>
    		    <div class="img_cont_msg">
        									<img src="${avtCont}" class="rounded-circle user_img_msg">
        								</div>
        								<div class="msg_cotainer" style="display: inline-block;height: auto;  word-wrap: break-word;">
        									${data.content}
        									<span class="msg_time_send">${formattedDate+" "+formattedTime}</span>
        								</div>
        							</div>`
        }
    }
    html += `<div id=${userReceive}></div>`
    document.getElementById("mess_" + userReceive).innerHTML = html
})

socket.on("server-send-message", function(data) {
    var userReceive = document.getElementById("userContact").value
    var users = document.getElementById("current").value
    if (data.id === userReceive && data.contact === users) {
        document.getElementById(userReceive).innerText = data.us + " is typing "
    }
});
socket.on("server-stop-typing", function(data) {
    var userReceive = document.getElementById("userContact").value
    var users = document.getElementById("current").value
    if (data.id === userReceive && data.contact === users) {
        document.getElementById(userReceive).innerText = ""
    }
});
socket.on("update-read-server", (data) => {
    document.getElementById("unseen_" + data).innerText = "0"
})

socket.on("server-update", (data) => {
    $.ajax({
        url: "/user/getOnline",
        type: "get",
        success: function(response) {
            socket.emit("client-login", response)

        },
        error: function(error) {
            alert(error.message)
        }
    })
})

function texting() {
    var content = document.getElementById("content").value
    var users = document.getElementById("current").value
    var userReceive = document.getElementById("userContact").value

    var userTyping = document.getElementById("currentUser").textContent
    if (content.length > 0) {
        socket.emit("user-send-message", { id: users, us: userTyping, contact: userReceive })
    } else {
        socket.emit("user-stop-typing", { id: users, us: userTyping, contact: userReceive })
    }

}

function logout() {
    $.ajax({
        url: "/logout",
        type: "get",
        success: function(response) {
            socket.emit("user-logout", response)
            window.location.href = "/login"
        },
        error: function(error) {
            alert(error.message)
        }
    })
}
socket.on("users", (data) => {
    $.ajax({
        url: "/user/getOnline",
        type: "get",

        success: function(response) {
            socket.emit("client-login", response)

        },
        error: function(error) {
            alert(error.message)
        }
    })

})

function remove(id) {
    $.ajax({
        url: "/chat/remove",
        type: "post",
        data: {
            idChat: id
        },
        success: (data) => {
            socket.emit("remove-chat", { id: id, msg: data.msg })
        },
        error: (err) => {
            console.log(err)
        }
    })
}
socket.on("display-remove", (data) => {
    const mess = document.getElementById(data.id)
    mess.remove()
})

function closeDetail() {
    var content = document.getElementById("detailMess")
    content.style.display = "none"
}