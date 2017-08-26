
const pass = $("#password")[0];
const cpass = $("#confirm-password")[0];
const check = () => {
    if (pass.value !== cpass.value) {
        cpass.setCustomValidity("Confirm Password does not match old password");
    } else {
        cpass.setCustomValidity("");
    }
}
