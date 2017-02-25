$(document).ready(function() {
    var i = 1;

    function insert(text) {
        $(".list").append("<li>" + text + "</li>");
    }

    while (i <= 100) {
        var text = "";
        if ((i % 3) == 0) {
            text = "Trojka"
        };
        if ((i % 5) == 0) {
            text += "Petka"
        }
        if (!text) {
            text = i;
        }
        insert(text);
        i++
    };
});