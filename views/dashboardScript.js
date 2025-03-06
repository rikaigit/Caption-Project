$(document).ready(function (){
    $("#btnAddPost").on("click", function(){
        window.location.assign("/postAdd")
    });
    $("#selectAll").on("click", function(){
        $(".selectAllChildCheckbox").prop("checked", this.checked);
    });
 
});
