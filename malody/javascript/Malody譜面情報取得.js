javascript:void((function(f){
    var script = document.createElement('script');
    script.src = '//code.jquery.com/jquery-3.2.1.min.js';
    script.onload = function(){
     var $ = jQuery.noConflict(true);
     f($);
    };
    document.body.appendChild(script); } )( function($, undefined){ ;;; console.log('jQuery: ', $().jquery); $(function () {
/*遅延させるための時間（ミリ秒）
var username = $(".right>.name>span").textContent;*/
username = "aburisalmon";
var username_find = new RegExp(username);
const delay = 0;

/*リクエストするURLの配列*/
const links = ["117286",
"116829"];

/*リクエストを順番に送信するためのカウンタ変数*/
let counter = 0;
for(var i = 0; i <= links.length; i++){
    $(".record").append("<div class=get></div>");
}
$('.get').css('font-size', '12px');

function sendRequest() {
  if (counter >= links.length) {
    alert("全てのリクエストが完了しました");
    return;
  }

  const link = links[counter];

  /*AJAXリクエストを実行*/
  $.ajax({
    url: "https://m.mugzone.net/chart/" + link,
    method: "GET",
    datatype: "html",
    success: function (html) {
      console.log("リクエスト成功");
      var rank = 0;
        var userrank = 0;
    for(k = 0; k < 40; k++){
        userrank = 40;
        if($(html).find(".name a").eq(k).text().match(username_find)){
            userrank = k;
            k = 41;
        }
    }
        var obj = $(html).find(".list li").eq(rank);
        var name = $(html).find(".name a").eq(rank);
        var score = $(html).find("li .score").eq(rank);
        var combo = $(html).find("li .combo").eq(rank);
        var scoretime = $(html).find("li .time").eq(rank);
        if(obj.find(".g_mod").hasClass('g_mod_4')){
        var mod = "DH";
        } else if(obj.find(".g_mod").hasClass('g_mod_5')){
        var mod = "RH";
        } else{
        var mod = "-";
        }
        var acc = $(html).find(".acc em").eq(rank);
        var judgecount = obj.attr("title");
       
        var userobj = $(html).find(".list li").eq(userrank);
        var userscore = $(html).find("li .score").eq(userrank);
        var usercombo = $(html).find("li .combo").eq(userrank);
        var userscoretime = $(html).find("li .time").eq(userrank);
        if(userobj.find(".g_mod").hasClass('g_mod_4')){
        var usermod = "DH";
        } else if(userobj.find(".g_mod").hasClass('g_mod_5')){
        var usermod = "RH";
        } else{
        var usermod = "-";
        }
        var useracc = $(html).find(".acc em").eq(userrank);
        var userjudgecount = userobj.attr("title");

        var diffculty = $(html).find(".mode span").eq(0);
        var song = $(html).find(".title").eq(0).remove(".title>em");
        song = song.remove(".title>span");
        var cid = $(html).find(".sub span").eq(0);
        var editor = $(html).find(".mode a").eq(0);
        var last_edit = $(html).find(".sub span").eq(3);
            
        var mode = $(html).find(".mode img").eq(0).attr("src");
        var hot = $(html).find(".num span").eq(1);
        var gold = $(html).find(".num span").eq(3);
        var recommend = $(html).find(".num span").eq(0);
    
    /*
        $(".get").eq(counter).append("<br>");
        $(".get").eq(counter).append(mode);
        */
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(cid);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(song);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(diffculty);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(editor);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(hot);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(gold);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(recommend);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(last_edit);
        $(".get").eq(counter).append(";");
        
        $(".get").eq(counter).append(name);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(mod);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(acc);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(judgecount);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(score);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(combo);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(scoretime);
        $(".get").eq(counter).append(";");
            
        $(".get").eq(counter).append(username);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(userrank + 1);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(usermod);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(useracc);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(userjudgecount);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(userscore);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(usercombo);
        $(".get").eq(counter).append(";");
        $(".get").eq(counter).append(userscoretime);
        $(".get").eq(counter).append(";");


      /*次のリクエストを送信する前に一定時間待つ*/
      setTimeout(sendRequest, delay);
    },
    error: function (xhr, status, error) {
      console.error("リクエストエラー:", error);
      $.ajax(this);
    }
  });

  counter++;
}

/*最初のリクエストを送信*/
sendRequest();

    $("script").remove();
  });
} ) );