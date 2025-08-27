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
         var first_exp = $(document).find(".item-top").eq(0).find(".lv").text();
         var first_count = $(document).find(".item-top").eq(0).find(".pc").text();
         var second_exp = $(document).find(".item-top").eq(1).find(".lv").text();
         var second_count = $(document).find(".item-top").eq(1).find(".pc").text();
         first_exp = first_exp.replace(/Lv\.\d+\s*-\s*/g, "");
         second_exp = second_exp.replace(/Lv\.\d+\s*-\s*/g, "");
         first_count = first_count.replace("プレイ回数:", "");
         second_count = second_count.replace("プレイ回数:", "");

         navigator.clipboard.writeText(`${second_exp}\t${second_count}\t${first_exp}\t${first_count}`).then(() => {
            alert("コピーしました");
         }).catch(err => {
            alert("コピー失敗:", err);
         });
      });

   }
)
);