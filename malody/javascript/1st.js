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
            <div class="get my-script-temp" style="border:2px solid #ccc; background:#f9f9f9; padding:2px; margin:4px 0; border-radius:5px;">
                <h3 style="font-size: 24px; color:#bfa003; margin-bottom:1px; text-shadow: 1px 1px 0 #FFFFFF,-1px 1px 0 #FFFFFF,1px -1px 0 #FFFFFF,-1px -1px 0 #FFFFFF;;">1st</h3>
                <div class="name-" style="margin-bottom:2px; font-weight:bold; font-size:15px"></div>
                <div class="mod-acc-" style="font-size: 15px; margin-bottom:2px;"></div>
                <div class="result-" style="font-size: 12px; clolr: #444 margin-bottom:2px;"></div>
            </div>
        `);

        $('.get').css('font-size', '12px');
        $('.get h3').css('color', '#bfa003');

        /* 各リンクにアクセスしてデータ取得 */
        for (var i = 0; i <= 17; i++) {
            let j = i;
            $.ajax({
                url: links[j],
                cache: false,
                dataType: "html",
                success: function (html) {
                    var obj = $(html).find(".list li").eq(0);
                    var result = $(html).find(".list li").eq(rank).attr("title");
                    var box2 = "-";
                    $(".get").eq(j).css("background", "#eeeeee");

                    /* MOD 判定 */
                    if (obj.find(".g_mod").hasClass('g_mod_4')) {
                        box2 = "DH";
                        $(".get").eq(j).css("background", "#ffccaa");
                    } else if (obj.find(".g_mod").hasClass('g_mod_5')) {
                        box2 = "RH";
                        $(".get").eq(j).css("background", "#ffaaaa");
                    }

                    $(".get").eq(j).css("border", "2px solid #bfa003");
                    var acc = $(html).find(".list .acc em").eq(0).text();
                    var test_score1 = $(html).find(".list .score").eq(0).text();
                    var test_score2 = $(html).find(".list .score").eq(1).text();
                    var count = 0;
                    var name = $(html).find(".list .name").eq(0);
                    for (; test_score1 == test_score2 && count < 40 && acc == "100%"; count++) {
                        name = $(html).find(".list .name").eq(count);
                        test_score2 = $(html).find(".list .score").eq(count + 1).text();
                    }

                    /* データ表示 */
                    $(".name-").eq(j).append(name);
                    $(".mod-acc-").eq(j).append(box2 + " " + acc);
                    if (count) {
                        $(".mod-acc-").eq(j).append("(" + count + ")");
                    }
                    $(".result-").eq(j).append(result);

                    /* 進捗マーク */
                    $("#progress").append("*");
                },
            });
        }
    });
}));
