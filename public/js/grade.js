// (function() {
//     const grade = $("#grade");
//     const updateGrade = $("#update-grade");
//     const teacherR = $("#teacher-comment");
//     const updateComment = $("#update-teacher-comment");
//     updateGrade.addEventListener("click", () => {
//         let data = {grade: grade.value};
//         if (Number(data.grade) === NAN)
//             return;
//         $.ajax({
//             type: "PUT",
//             url: "/class/{{class.id}}/{{assignment.id}}/{{student}}/grade",
//             data: data,
//             success: function (data) {
//
//             },
//             dataType: "json",
//             contentType: "application/json"
//         });
//     });
//     updateComment.addEventListener("click", () => {
//         let data = {comment: teacherR.innerHTML};
//         if (data.comment === "")
//             return;
//         $.ajax({
//             type: "PUT",
//             url: "/class/{{class.id}}/{{assignment.id}}/{{student}}/comment",
//             data: data,
//             success: function(data) {
//
//             },
//             dataType: "json",
//             contentType: "application/json"
//         });
//     });
// })();