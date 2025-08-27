javascript: void ((function (f) {
    var script = document.createElement('script');
    script.src = '//code.jquery.com/jquery-3.2.1.min.js';
    script.onload = function () {
        var $ = jQuery.noConflict(true);
        f($);
    };
    document.body.appendChild(script);
})(function ($, undefined) {
    console.log('jQuery: ', $().jquery);

    $(function () {
        var links = [];
        links.length = 0;

        /* マップリンクを収集 */
        $('#maps .g_map .link').each(function (index) {
            links.push($(this).attr('href'));
        });
        console.log(links);

        /* UI初期化 */
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

        /* メタ情報ブロック追加 */
        $(".g_map").append(`
            <div class="get my-script-temp" style="border:2px solid #ccc; background-color:#f9f9f9; padding:2px; margin:4px 0; border-radius:5px;">
                <a class="c" href="" target="_blank" style="font-size: 15px; background-color:#ddd; margin-bottom:2px; width:40px; height:40px;"></a>
                <a class="e" href="" target="_blank" style="font-size: 15px; background-color:#ddd; margin-bottom:2px; width:40px; height:40px;"></a>
                <a class="d" href="" target="_blank" style="font-size: 15px; background-color:#ddd; margin-bottom:2px; width:40px; height:40px;"></a>
            </div>
        `);

        $('.get').css('font-size', '12px');

        /* 各リンクにアクセスしてデータ取得 */

        var nameText = document.querySelector('.center a b').textContent;
        for (var i = 0; i <= 17; i++) {
            let j = i;
            $.ajax({
                url: links[j],
                cache: false,
                dataType: "html",
                success: function (html) {
                    var obj1 = $(html).find(".g_tmpl_first").eq(0).find(".avatar img");
                    var obj1_link = $(html).find(".g_tmpl_first").eq(0).find(".right a").attr('href');
                    var obj2 = $(html).find(".g_tmpl_first").eq(1).find(".avatar img");
                    var obj2_link = $(html).find(".g_tmpl_first").eq(1).find(".right a").attr('href');
                    var obj3 = $(html).find(".g_tmpl_first").eq(2).find(".avatar img");
                    var obj3_link = $(html).find(".g_tmpl_first").eq(2).find(".right a").attr('href');

                    console.log(obj2);
                    $(".get .c").eq(j).append(obj1);
                    $(".get .c").eq(j).attr('href', obj1_link);
                    $(".get .e").eq(j).append(obj2);
                    $(".get .e").eq(j).attr('href', obj2_link);
                    $(".get .d").eq(j).append(obj3);
                    $(".get .d").eq(j).attr('href', obj3_link);
                    $('.get').css('display', 'flex');
                    $('.get').css('justify-content', 'space-around');
                    $(".get .c").eq(j).css("border", "2px solid #f0c267");
                    $(".get .e").eq(j).css("border", "2px solid #ef6666");
                    $(".get .d").eq(j).css("border", "2px solid #f09567");
                    $('.get img').css('max-height', '40px');

                    /* 進捗マーク */
                    $("#progress").append("*");
                },
            });
        }
    });
}));
