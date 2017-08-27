
const pass = $("#password")[0];
const cpass = $("#confirm-password")[0];
const id = $("#ID")[0];
const check = () => {
    if (pass.value !== cpass.value) {
        cpass.setCustomValidity("Confirm Password does not match old password");
    } else {
        cpass.setCustomValidity("");
    }
}
const valid = () => {
    let value = Number(id.value);
    if (Number.isInteger(value) && id.value.length === 8) {
        id.setCustomValidity("");
    } else {
        id.setCustomValidity('Id must be 8 numerical characters');
    }
}
