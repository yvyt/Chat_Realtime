function chooseAvatar() {

    var visit = document.getElementById("visitId").value
    if (!visit) {
        document.getElementById("file-input").click();

    }
}
document.getElementById("file-input").addEventListener("change", function() {
    var file = this.files[0];
    var reader = new FileReader();
    // Xử lý sự kiện khi FileReader đọc xong tệp tin
    reader.onload = function() {
        // Lấy dữ liệu hình ảnh được đọc và hiển thị trong phần tử <img>
        var dataURL = reader.result;
        var imgPreview = document.getElementById("avatar");
        imgPreview.src = dataURL;
        let html = `<input style='background: hsla(211, 96%, 62%, 1);border: none;  color: white;' onclick=updateAvt() type="submit" value="Save"></input>`
        document.getElementById("buttonUpdate").innerHTML = html
    };

    // Đọc tệp tin dưới dạng URL
    reader.readAsDataURL(file);
});

function updateAvt() {
    const img = document.getElementById("file-input").value
    console.log(img)
}
$(document).ready(function() {
    var visit = document.getElementById("visitId").value
    if (!visit) {
        document.getElementById("changePass").innerHTML = `<a href="/changePass">Change Password</a>`

    }
})

function changePass() {
    var old = document.getElementById("old").value
    var newPass = document.getElementById("new").value
    var confirm = document.getElementById("confirm").value

    $.ajax({
        url: "/user/changePass",
        type: "post",
        data: {
            oldPass: old,
            newPass: newPass,
            confirm: confirm
        },
        success: (data) => {
            document.getElementById("error").innerText = data.message
        },
        error: function(error) {
            alert(error.message)
        }
    })
}