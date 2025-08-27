javascript:void((function(f){
  var script = document.createElement('script');
  script.src = '//code.jquery.com/jquery-3.2.1.min.js';
  script.onload = function(){
   var $ = jQuery.noConflict(true);
   f($);
  };
  document.body.appendChild(script); } )( function($, undefined){ ;;; console.log('jQuery: ', $().jquery); $(function () {
    sid = $(".temp").data("id");
    $(".temp input").eq(0).val("Empty_" + sid);
    $(".temp input").eq(1).val("");
    $(".temp input").eq(2).val("Empty");
    $(".temp input").eq(3).val("");
    $(".temp input").eq(4).val("0");
    $(".temp input").eq(5).val("0.0");
    for(let i=0;i<23;i++){
      $(".tag_area span").eq(i).removeClass("curr");
    }

    $(".g_btn").eq(0).click();

    $("script").remove();
});
} ) );