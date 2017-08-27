function del(courseId) {
    $.ajax({
        url: `/class/${courseId}`,
        type: 'DELETE',
        success: function(data) {
            location.replace("/class");
        }
    });
}