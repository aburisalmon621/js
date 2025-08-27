javascript: void ((function (f) {
   var script = document.createElement('script');
   script.src = '//code.jquery.com/jquery-3.2.1.min.js';
   script.onload = function () {
      var $ = jQuery.noConflict(true);
      f($);
   };
   document.body.appendChild(script);
}
)(
   function ($, undefined) {

      console.log('jQuery: ', $().jquery);
      $(function () {
         var links = [];
        $('#maps .g_map .link').each(function (index) {
            links.push($(this).attr('href'));
        });
         console.log(links);

         $("#progress, .get, .my-script-temp").remove();
         $("#option").append("<div id=progress>---進捗---</div>");
         $("#progress").append("<br>******************<br>");
         const mapElements = document.querySelectorAll('.g_cont .g_map');
         const mapElements2 = document.querySelectorAll('.g_map .cover');

        mapElements.forEach(el => {
            el.style.setProperty('margin', '10px 16px 12px 0', 'important');
            el.style.setProperty('height', '150px', 'important');
        });
        mapElements2.forEach(el => {
            el.style.setProperty('height', '100px', 'important');
        });

        $(".g_map").append(`
            <div class="get my-script-temp" style="border:1px solid #ccc; background:#f9f9f9; padding:2px; margin:4px 0; border-radius:5px;">
                <div class="name-" style="margin-bottom:2px; font-weight:bold; font-size:15px"></div>
                <div class="add_text" style="font-size: 15px; margin-bottom:2px;"></div>
            </div>
        `);
        $('.get').css('font-size', '12px');

         for (var i = 0; i <= 17; i++) {
            let j = i;
            $.ajax({
               url: links[j],
               cache: false,
               datatype: "html",
               success: function (html) {
                  var gold = $(html).find(".num span").eq(1).text();
                  var hot = $(html).find(".num span").eq(3).text();
                  var eva = $(html).find(".num span").eq(0).text();
                  $(".add_text").eq(j).append("hot:");
                  $(".add_text").eq(j).append(hot);
                  $(".add_text").eq(j).append("<br>gold:");
                  $(".add_text").eq(j).append(gold);
                  $(".add_text").eq(j).append("<br>");
                  $(".add_text").eq(j).append(eva);
                  $("#progress").append("*");
               },
            });
         }
      });

   }
)
);