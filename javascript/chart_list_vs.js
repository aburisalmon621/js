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

        $('#maps .g_map .link').each(function (index) {
            links.push($(this).attr('href'));
        });
        console.log(links);

        let shadow_white = "1px 1px 0 #eee,-1px 1px 0 #eee,1px -1px 0 #eee,-1px -1px 0 #eee";
        let shadow_silver = "1px 1px 0 #bbb,-1px 1px 0 #aaa,1px -1px 0 #bbb,-1px -1px 0 #aaa";
        let shadow_gold = "1px 1px 0 #fea,-1px 1px 0 #fea,1px -1px 0 #fea,-1px -1px 0 #fea";
        let shadow_rainbow = `
   1px  1px 0 rgba(255, 180, 180, 0.9),
  -1px  1px 0 rgba(255, 210, 160, 0.9),
   1px -1px 0 rgba(255, 255, 180, 0.9),
  -1px -1px 0 rgba(180, 240, 180, 0.9),
   2px  2px 0 rgba(180, 210, 255, 0.9),
  -2px -2px 0 rgba(200, 180, 255, 0.9),
   2px -2px 0 rgba(240, 200, 255, 0.9)
`;
        var nameText = document.querySelector('.center a b').textContent;
        /* 初期化 */
        $("#progress, .get, .my-script-temp").remove();
        $("#option").append("<div id=progress>---進捗---<p class='max' style='height:15px;'>******************</p><p class='now'></p></div>");
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
            <div class="get my-script-temp" style="border:2px solid #ccc; background:#f9f9f9; height:150px; padding:2px; margin:4px 0; border-radius:5px;">
                <h3 class="rank-" style="margin-bottom:1px; text-shadow: 1px 1px 0 #eee,-1px 1px 0 #eee,1px -1px 0 #eee,-1px -1px 0 #eee;"></h3>
                <div class="name-" style="margin-bottom:2px; font-weight:bold; font-size:15px;"></div>
                <div class="mod-acc-" style="font-size: 14px; margin-bottom:2px;"></div>
                <div class="result-" style="font-size: 12px; clolr: #444 margin-bottom:2px;"></div>
            </div>
        `);

        $('.get').css('font-size', '12px');


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

                    /* MOD */
                    if (rank < 40 && obj.find(".g_mod").hasClass('g_mod_4')) {
                        box2 = "DH";
                        $(".get").eq(j).css("background", "#ffccaa");
                    } else if (rank < 40 && obj.find(".g_mod").hasClass('g_mod_5')) {
                        box2 = "RH";
                        $(".get").eq(j).css("background", "#ffaaaa");
                    }

                    var acc = $(html).find(".list .acc em").eq(rank).text();
                    var score = $(html).find(".list .score").eq(rank).text();
                    var result = $(html).find(".list li").eq(rank).attr("title");
                    var first_score = $(html).find(".list .score").eq(0).text();
                    var test_score2 = first_score;
                    var count = 0;
                    if (!acc) {
                        acc = "0%";
                    }

                    let value = parseFloat(acc.replace("%", ""));
                    if (value >= 99) {
                        $(".mod-acc-").eq(j).css('text-shadow', shadow_gold);
                        $(".result-").eq(j).css('text-shadow', shadow_gold);
                    }
                    else if (value >= 98) {
                        $(".mod-acc-").eq(j).css('text-shadow', shadow_silver);
                        $(".result-").eq(j).css('text-shadow', shadow_silver);
                    }

                    for (; first_score == score && first_score == test_score2 && count < 40 && acc == "100%"; count++) {
                        rank = 0;
                        test_score2 = $(html).find(".list .score").eq(count + 1).text();
                        $(".mod-acc-").eq(j).css('text-shadow', shadow_rainbow);
                        $(".result-").eq(j).css('text-shadow', shadow_rainbow);
                    }

                    /* データ表示 */
                    if (rank == 40) {
                        $(".rank-").eq(j).append("-");
                    }
                    else {
                        $(".rank-").eq(j).append(rank + 1);
                    }

                    const rankStyles = {
                        0: { suffix: "st", color: "#ffcc00", fontSize: "24px", marginTop: "0px" },
                        1: { suffix: "nd", color: "#b1b1b1", fontSize: "22px", marginTop: "2px" },
                        2: { suffix: "rd", color: "#d1714b", fontSize: "20px", marginTop: "4px" },
                        top10: { suffix: "th", color: "#555555", fontSize: "18px", marginTop: "6px" },
                        default: { suffix: "th", color: "#555555", fontSize: "16px", marginTop: "8px" }
                    };

                    let styleData;
                    if (rank === 0) {
                        styleData = rankStyles[0];
                    } else if (rank === 1) {
                        styleData = rankStyles[1];
                    } else if (rank === 2) {
                        styleData = rankStyles[2];
                    } else if (rank < 10) {
                        styleData = rankStyles.top10;
                    } else {
                        styleData = rankStyles.default;
                    }

                    $(".rank-").eq(j).append(styleData.suffix);
                    $('.get h3').eq(j).css({
                        color: styleData.color,
                        fontSize: styleData.fontSize,
                        marginTop: styleData.marginTop
                    });
                    $(".get").eq(j).css("border", `4px solid ${styleData.color}`);

                    $(".mod-acc-").eq(j).append(box2 + " " + acc);
                    if (count) {
                        $(".mod-acc-").eq(j).append(`(${count})`);
                    }
                    $(".result-").eq(j).append(result);

                    $(".now").append("*");
                },
            });
        }
    });
}));
