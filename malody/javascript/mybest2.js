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
                <h3 class="rank-" style="font-size: 24px; margin-bottom:1px; text-shadow: 1px 1px 0 #eee,-1px 1px 0 #eee,1px -1px 0 #eee,-1px -1px 0 #eee;"></h3>
                <div class="mod-" style="margin-bottom:2px; font-size:16px; text-shadow: 1px 1px 0 #111,-1px 1px 0 #111,1px -1px 0 #111,-1px -1px 0 #111;"></div>
                <div class="acc-" style="font-size: 18px; margin-bottom:2px;"></div>
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
                    var obj = $(html).find(".list li").eq(0);
                    var name = $(html).find(".list .name").eq(0);
                    var box2 = "-";
                    $(".get").eq(j).css("background", "#eeeeee");
                    var rank = 0;
                    while (rank < 40) {
                        obj = $(html).find(".list li").eq(rank);
                        name = $(html).find(".list .name").eq(rank);
                        if (nameText == name.text()) {
                            break;
                        }
                        rank++;
                    }
                    /* MOD 判定 */
                    $(".g_map .link").eq(j).css("background-color", "#ffffff");
                    if (obj.find(".g_mod").hasClass('g_mod_4')) {
                        box2 = "DH";
                        $(".g_map .link").eq(j).css("background-color", "#ffeecc");
                        $(".mod-").eq(j).css("color", "#ffccaa");
                    } else if (obj.find(".g_mod").hasClass('g_mod_5')) {
                        box2 = "RH";
                        $(".g_map .link").eq(j).css("background-color", "#ffcccc");
                        $(".mod-").eq(j).css("color", "#ffaaaa");
                    }

                    var acc = $(html).find(".list .acc em").eq(rank).text();
                    var score = $(html).find(".list .score").eq(rank).text();
                    var test_score1 = $(html).find(".list .score").eq(0).text();
                    var test_score2 = $(html).find(".list .score").eq(0).text();
                    var count = 0;
                    if (!acc) {
                        acc = "0%";
                    }
                    for (; test_score1 == score && test_score1 == test_score2 && count < 40 && acc == "100%"; count++) {
                        rank = 0;
                        test_score2 = $(html).find(".list .score").eq(count + 1).text();
                        $(".acc-").eq(j).css('text-shadow', '1px 1px 0 #fff,-1px 1px 0 #fff,1px -1px 0 #fff,-1px -1px 0 #fff');
                    }

                    /* データ表示 */
                    if (rank == 40) {
                        $(".rank-").eq(j).append("-");
                    }
                    else {
                        $(".rank-").eq(j).append(rank + 1);
                    }
                    if (rank == 0) {
                        $(".rank-").eq(j).append("st");
                        $('.get h3').eq(j).css('color', '#f3cb00');
                        $('.get h3').eq(j).css('font-size', '24px');
                        $('.get h3').eq(j).css('margin-top', '0px');
                        $(".get").eq(j).css("background", "#f3cb00");
                    }
                    else if (rank == 1) {
                        $(".rank-").eq(j).append("nd");
                        $('.get h3').eq(j).css('color', '#b1b1b1');
                        $('.get h3').eq(j).css('font-size', '22px');
                        $('.get h3').eq(j).css('margin-top', '2px');
                        $(".get").eq(j).css("background", "#b1b1b1");
                    }
                    else if (rank == 2) {
                        $(".rank-").eq(j).append("rd");
                        $('.get h3').eq(j).css('color', '#d1714b');
                        $('.get h3').eq(j).css('font-size', '20px');
                        $('.get h3').eq(j).css('margin-top', '4px');
                        $(".get").eq(j).css("background", "#d1714b");
                    }
                    else if (rank < 10) {
                        $(".rank-").eq(j).append("th");
                        $('.get h3').eq(j).css('color', '#111111');
                        $('.get h3').eq(j).css('font-size', '18px');
                        $('.get h3').eq(j).css('margin-top', '6px');
                        $(".get").eq(j).css("background", "#eeeeee");
                    }
                    else {
                        $(".rank-").eq(j).append("th");
                        $('.get h3').eq(j).css('color', '#111111');
                        $('.get h3').eq(j).css('font-size', '16px');
                        $('.get h3').eq(j).css('margin-top', '8px');
                        $(".get").eq(j).css("background", "#eeeeee");
                    }

                    $(".mod-").eq(j).append(box2);
                    $(".acc-").eq(j).append(acc);
                    if (count) {
                        $(".acc-").eq(j).append("(" + count + ")");
                    }

                    /* 進捗マーク */
                    $("#progress").append("*");
                },
            });
        }
    });
}));
