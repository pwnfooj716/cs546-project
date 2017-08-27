const grade = $("#grade")[0];
//const updateGrade = $("#update-grade");
const teacherR = $("#teacher-comment")[0];
//const updateComment = $("#update-teacher-comment");
function grader (classId, assignmentId, studentId){
    let data = {grade: grade.value};
    if (isNaN(Number(data.grade)) || data.grade.length > 3) {
        return;
    }
    $.ajax({
        type: 'PUT',
        url: `/class/${classId}/${assignmentId}/${studentId}/grade`,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json"
    });
}
function comment(classId, assignmentId, studentId) {
    let data = {comment: teacherR.value};
    if (data.comment === "")
        return;
    $.ajax({
        type: 'PUT',
        url: `/class/${classId}/${assignmentId}/${studentId}/comment`,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json"
    });
}
