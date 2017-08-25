(function() {
    const form = document.getElementById("class-form");
    let arr = [];
    if (form) {
        const name = document.getElementById("name");
        const idbox = document.getElementById("student");
        const addS = document.getElementById("add-student");
        const students = document.getElementById("students");
        const error = document.getElementById("error");
        addS.addEventListener("click", () =>{
            let text = idbox.value;
            let exist = arr.find((x) => (x === text));
            error.innerHTML="";
            error.style.visibility = 'hidden';
            if (text.length !== 8) {
                error.innerHTML = "ID must have a length of 8";
                error.style.visibility = 'visible';
                return;
            }
            if (!exist) {
                let data = {student: text};
                $.ajax({
                    url: "/class/student",
                    data: data,
                    success: function(data) {
                        let json = data;
                        if (json.isStudent) {
                            //adds student
                            arr.push(text);
                            let newLi = document.createElement("li");
                            let newDiv = document.createElement("div");
                            let newText = document.createTextNode(text);
                            newDiv.appendChild(newText);
                            newLi.appendChild(newDiv);
                            students.appendChild(newLi);
                        } else {
                            //alert not student
                            error.innerHTML = "student does not exist";
                            error.style.visibility = 'visible';
                        }
                        idbox.value = "";
                    },
                    dataType: "json",
                    contentType: "application/json"
                });
            }
            else  {
                error.innerHTML = "student is already in class";
                error.style.visibility = 'visible';
            }
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let data = {
                name: name.value,
                ids: arr
            }
            error.innerHTML = "";
            error.style.visibility = 'hidden';
            $.post("/class", data, function(data, status) {
                if (status === 'success')
                window.location.replace("/class");
                else {
                    error.innerHTML = "There was an error creating the class";
                    error.style.visibility = 'visible';
                }

            });
        })
    }
})();
