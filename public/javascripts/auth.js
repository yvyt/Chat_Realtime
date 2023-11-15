function register() {
    var username = document.getElementById("name").value
    var email = document.getElementById("emailRegister").value
    var password = document.getElementById("passwordRegister").value
    var confirm = document.getElementById("confirm").value
    $.ajax({
        url: "/auth/register",
        type: "POST",
        data: {
            username: username,
            email: email,
            password: password,
            confirm: confirm
        },
        success: function(response) {
            console.log(response)
            if (response.code == 0) {
                document.getElementById("error").innerText = response.msg

            } else {
                window.location.href = "/login"
            }
        },
        error: function(error) {
            alert(error.message)
        }
    })
}
var socket = io("http://localhost:3000/")

function login() {
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    $.ajax({
        url: "/auth/login",
        type: "POST",
        data: {
            email: email,
            password: password,
        },
        success: function(response) {
            console.log(response)
            if (response.code == 0) {
                document.getElementById("errorLogin").innerText = response.msg

            } else {
                window.location.href = "/"
            }
        },
        error: function(error) {
            alert(error.message)
        }
    })
}