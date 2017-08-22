(function() {
    const form = document.getElementById("class-form");
    let arr = [];
    if (form) {
        const name = document.getElementById("name");
        const idbox = document.getElementById("student");
        const addS = document.getElementById("add-student");
        const students = document.getElementById("students");
        addS.addEventListener("click", () =>{
            let text = idbox.value;
            let exist = arr.find((x) => (x === text));
            if (!exist) {
                arr.push(text);
                let newLi = document.createElement("li");
                let newDiv = document.createElement("div");
                let newText = document.createTextNode(text);
                newDiv.appendChild(newText);
                newLi.appendChild(newDiv);
                students.appendChild(newLi);
                idbox.value = "";
            }
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let data = {
                name: name.value,
                ids: arr
            }
            $.post("/class", data, function(data) {
                window.location.replace("/class");
            }).fail(()=> {
                alert("fail");
            });
        })
    }
})();
