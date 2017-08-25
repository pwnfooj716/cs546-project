(function() {
    const pass = $("#password");
    const cpass = $("#confirm-password");
    const check = () => {
        if (pass.val() !== cpass.val()) {
            cpass.setCustomValidity("Confirm Password does not match old password");
        } else {
            cpass.setCustomValidity("");
        }
    }
    pass.addEventListener("onclick", check);
    cpass.addEventListener("onkeyup", check);
})();
//implement ajax feature to make sure that id is not already taken