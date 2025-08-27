javascript:void((function(f){
    var script = document.createElement('script');
    script.src = '//code.jquery.com/jquery-3.2.1.min.js';
    script.onload = function(){
     var $ = jQuery.noConflict(true);
     f($);
    };
    document.body.appendChild(script); } )( function($, undefined){ ;;; console.log('jQuery: ', $().jquery); $(function () {
/*遅延させるための時間（ミリ秒）*/
const delay = 0;

/*リクエストを順番に送信するためのカウンタ変数*/
let counter = 0;
let maxcounter = 105000;
    $(".record").append("<div class=get></div>");
$('.get').css('font-size', '12px');

function sendRequest() {

  if (counter > maxcounter) {
    alert("全てのリクエストが完了しました");
    return;
  }

  for (let i = 0; i < 10; i++) {
  const j = i;
  /*AJAXリクエストを実行*/
  $.ajax({
    url: "https://m.mugzone.net/song/" + (counter + 27251),
    method: "GET",
    datatype: "html",
    success: function (html) {
      console.log("リクエスト成功");
        var title = $(html).find(".title");
        var sid = $(html).find(".sub span").eq(0);
        var second = $(html).find(".sub span").eq(1);
        var bpm = $(html).find(".sub span").eq(2);
        var last_edit = $(html).find(".sub span").eq(3);

        $(".get").append("<br>");
        $(".get").append(title);
        $(".get").append(";:");
        $(".get").append(sid);
        $(".get").append(";:");
        $(".get").append(second);
        $(".get").append(";:");
        $(".get").append(bpm);
        $(".get").append(";:");
        $(".get").append(last_edit);
        $(".get").append(";:");


      /*次のリクエストを送信する前に一定時間待つ*/
      if(i == 9){
        setTimeout(sendRequest, delay);
      }
    },
    error: function (xhr, status, error) {
      $(".get").append("<br>");
      $(".get").append("error");
      $(".get").append(";:");
      $(".get").append(counter - 10 + j + 1);
      $(".get").append(";:");
      if(i == 9){
        setTimeout(sendRequest, delay);
      }
    }
  });

  counter++;
}
}

/*最初のリクエストを送信*/
sendRequest();

    $("script").remove();
  });
} ) );