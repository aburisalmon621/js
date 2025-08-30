javascript: (async function () {
    /*jQuery を読み込む*/
    const loadJQuery = () =>
        new Promise(resolve => {
            const script = document.createElement("script");
            script.src = "//code.jquery.com/jquery-3.2.1.min.js";
            script.onload = () => resolve(jQuery.noConflict(true));
            document.body.appendChild(script);
        });

    const $ = await loadJQuery();
    console.log("jQuery:", $().jquery);

    /* ユーザー入力 */
    const mode_datas = ["Key", "Step", "Dj", "Catch", "Pad", "Taiko", "Ring", "Slide", "Live"];
    const nameText = prompt("ユーザー1の名前を入力してください:", "hazeiro");
    const nameText2 = prompt("ユーザー2の名前を入力してください:", "");
    const mode = prompt("モードを入力してください [0:Key, 1:Step, 2:Dj, 3:Catch, 4:Pad, 5:Taiko, 6:Ring, 7:Slide, 8:Live]:", "0");
    const key = prompt("キーを入力してください:", "");

    let count = 0;
    let links = [];
    let tsv_datas = [];
    let score_max = 0;
    let score = 0;
    let rank_1 = 0;
    let rank_2 = 0;
    let rank_3 = 0;
    let rank_10 = 0;
    let rank_40 = 0;
    let rank_41 = 0;
    let rank_num = 0;
    let rank_ave = 0;
    let rh_100 = 0;
    let rh_99 = 0;
    let rh_98 = 0;
    let rh_0 = 0;
    let dh_0 = 0;
    let nomod_0 = 0;
    let acc = 0;
    let acc_ave = 0;

    /* UI 準備 */
    $(".get").remove();
    $(".body").append(`
  <div class="get" style="
    font-size:14px; 
    padding:15px; 
    border:1px solid #ccc; 
    border-radius:12px; 
    margin:15px 0;
    box-shadow:0 2px 6px rgba(0,0,0,0.15);
    background:#fafafa;
  ">
    <h2 style="
      font-size:18px;
      margin:0 0 10px;
      padding-bottom:5px;
      border-bottom:2px solid #4caf50;
      color:#333;
    ">Player Data<br>${mode_datas[mode]} ${key}</h2>
    
    <div class="data" style="margin-bottom:10px;">
      <div class="score" style="font-weight:bold;margin-bottom:10px;"></div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rank_1"></div>
        <div class="rank_2"></div>
        <div class="rank_3"></div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rank_10"></div>
        <div class="rank_40"></div>
        <div class="rank_41"></div>
      </div>
      <div class="rank_ave" style="margin-bottom:10px;"></div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rh_100"></div>
        <div class="rh_99"></div>
        <div class="rh_98"></div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rh_0"></div>
        <div class="dh_0"></div>
        <div class="nomod_0"></div>
      </div>
      <div class="acc"></div>
      <div class="acc_ave"></div>
    </div>

    <!-- 開閉式 TSV 出力結果 -->
    <div style="border-top:1px solid #ccc; padding-top:10px;">
      <div id="toggle-header" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
        <span style="font-size:14px; font-weight:bold; color:#333;">text_data</span>
        <span id="toggle-btn" style="font-size:18px; user-select:none;">▼</span>
      </div>
      <div id="toggle-content" style="margin-top:10px; display:none;">
        <textarea id="tx" rows="20" style="
          width:100%;
          font-family:monospace;
          font-size:12px;
          border-radius:8px;
          border:1px solid #ccc;
          padding:5px;
          box-sizing:border-box;
        "></textarea>
      </div>
    </div>
  </div>
`);
    /* 開閉処理 */
    $("#toggle-header").on("click", function () {
        const content = $("#toggle-content");
        const btn = $("#toggle-btn");
        if (content.is(":visible")) {
            content.slideUp(200);
            btn.text("▼");
        } else {
            content.slideDown(200);
            btn.text("▲");
        }
    });
    /* 進捗バー */
    $("body").append(`
    <div class="progress-fixed" style="
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      height:30px;
      background:#eee;
      border-top:1px solid #ccc;
      z-index:9999;
    ">
      <div class="progress-bar" style="
        height:100%;
        width:0%;
        background:linear-gradient(90deg, #4caf50, #81c784);
        transition:width 0.3s;
      "></div>
      <span class="progress-text" style="
        position:absolute;
        top:0;
        left:50%;
        transform:translateX(-50%);
        font-size:13px;
        line-height:30px;
        color:#000;
        font-weight:bold;
      ">0%</span>
    </div>
  `);

    const urlBase = `https://m.mugzone.net/page/chart/filter?count=30&mode=${mode}&status=2&key=${key}&page=`;

    /* 共通関数 */
    const parseHTML = html => new DOMParser().parseFromString(html, "text/html");
    const q = (doc, selector) => doc.querySelector(selector)?.textContent?.trim() || "-";

    /* Chart ID 一覧取得 */
    async function fetchChartIds() {
        const firstHtml = await (await fetch(urlBase + 0)).text();
        const firstDoc = parseHTML(firstHtml);
        const totalPage = JSON.parse(firstDoc.body.textContent).data.total;

        const promises = Array.from({ length: totalPage }, async (_, i) => {
            const html = await (await fetch(urlBase + i)).text();
            const doc = parseHTML(html);
            return JSON.parse(doc.body.textContent).data.list.map(item => item.id);
        });

        const results = await Promise.all(promises);
        links = results.flat();
    }

    async function fetchScore(id) {
        const url = `https://m.mugzone.net/chart/${id}`;
        const html = await (await fetch(url)).text();
        const doc = parseHTML(html);

        const getRank = (targetName) => {
            for (let i = 1; i <= 41; i++) {
                const name = q(doc, `.score_area .list li:nth-of-type(${i}) .name a`);
                if (name.match(targetName)) return i;
            }
            return 41;
        };

        let userRank = getRank(nameText);    // 1人目
        let userRank2 = getRank(nameText2);  // 2人目

        /* ====== 1位の情報 ====== */
        const firstnameText = q(doc, '.score_area li:nth-of-type(1) .name a');
        let firstmodText = "-";
        const firstmodElement = doc.querySelector('.score_area li:nth-of-type(1) .mod i');
        if (firstmodElement) {
            if (firstmodElement.classList.contains('g_mod_4')) firstmodText = "DH";
            else if (firstmodElement.classList.contains('g_mod_5')) firstmodText = "RH";
        }
        const firstaccText = q(doc, '.score_area li:nth-of-type(1) .acc em');
        const firstjudgecountText = doc.querySelector('.score_area li:nth-of-type(1)')?.getAttribute('title') || '-';
        const firstscoreText = q(doc, '.score_area li:nth-of-type(1) .score');
        const firstcomboText = q(doc, '.score_area li:nth-of-type(1) .combo');
        const firsttimeText = q(doc, '.score_area li:nth-of-type(1) .time');

        /* ====== ユーザー1の情報 ====== */
        let usermodText = "-";
        const usermodElement = doc.querySelector(`.score_area li:nth-of-type(${userRank}) .mod i`);
        if (usermodElement) {
            if (usermodElement.classList.contains('g_mod_4')) usermodText = "DH";
            else if (usermodElement.classList.contains('g_mod_5')) usermodText = "RH";
        }
        const useraccText = q(doc, `.score_area li:nth-of-type(${userRank}) .acc em`);
        const userjudgecountText = doc.querySelector(`.score_area li:nth-of-type(${userRank})`)?.getAttribute('title') || '-';
        const userscoreText = q(doc, `.score_area li:nth-of-type(${userRank}) .score`);
        const usercomboText = q(doc, `.score_area li:nth-of-type(${userRank}) .combo`);
        const usertimeText = q(doc, `.score_area li:nth-of-type(${userRank}) .time`);
        if (id == 39494) userRank -= 1;
        if (userscoreText.match(firstscoreText)) userRank = 1;

        /* ====== ユーザー2の情報 ====== */
        let usermodText2 = "-";
        const usermodElement2 = doc.querySelector(`.score_area li:nth-of-type(${userRank2}) .mod i`);
        if (usermodElement2) {
            if (usermodElement2.classList.contains('g_mod_4')) usermodText2 = "DH";
            else if (usermodElement2.classList.contains('g_mod_5')) usermodText2 = "RH";
        }
        const useraccText2 = q(doc, `.score_area li:nth-of-type(${userRank2}) .acc em`);
        const userjudgecountText2 = doc.querySelector(`.score_area li:nth-of-type(${userRank2})`)?.getAttribute('title') || '-';
        const userscoreText2 = q(doc, `.score_area li:nth-of-type(${userRank2}) .score`);
        const usercomboText2 = q(doc, `.score_area li:nth-of-type(${userRank2}) .combo`);
        const usertimeText2 = q(doc, `.score_area li:nth-of-type(${userRank2}) .time`);
        if (id == 39494) userRank2 -= 1;
        if (userscoreText2.match(firstscoreText)) userRank2 = 1;

        return {
            cId: id,
            title: q(doc, ".title").split(" - ")[1] || "Title not found",
            artist: q(doc, ".artist"),
            mode: q(doc, ".mode span"),
            editor: q(doc, '.mode a[href^="/accounts/user/"]'),
            na: q(doc, ".g_cont2 .num span"),
            hot: q(doc, ".g_cont2 .num:nth-of-type(3) span:nth-of-type(2)"),
            gold: q(doc, ".g_cont2 .num:nth-of-type(2) span"),
            cFirst: doc.querySelector(".g_tmpl_first:nth-of-type(1) .empty") ? "未" : "済",
            dFirst: doc.querySelector(".g_tmpl_first:nth-of-type(3) .empty") ? "未" : "済",
            eFirst: doc.querySelector(".g_tmpl_first:nth-of-type(2) .empty") ? "未" : "済",
            lastUpdate: q(doc, ".sub span:nth-of-type(4)"),
            // 1位情報
            firstnameText,
            firstmodText,
            firstaccText,
            firstjudgecountText,
            firstscoreText,
            firstcomboText,
            firsttimeText,
            // ユーザー1情報
            userRank,
            usermodText,
            useraccText,
            userjudgecountText,
            userscoreText,
            usercomboText,
            usertimeText,
            // ユーザー2情報
            userRank2,
            usermodText2,
            useraccText2,
            userjudgecountText2,
            userscoreText2,
            usercomboText2,
            usertimeText2
        };
    }


    function updateProgress(current, total) {
        const percent = Math.round((current / total) * 100);
        $(".progress-bar").css("width", percent + "%");
        $(".progress-text").text(`${current}/${total} (${percent}%)`);
    }

    await fetchChartIds();
    console.log("取得したリンク:", links);

    async function process() {
        updateProgress(count, links.length);

        if (count >= links.length) {
            alert("全てのリクエストが完了しました");
            $("#tx").append(tsv_datas);
            updateProgress(links.length, links.length);
            $(".progress-bar").css("background", "linear-gradient(90deg, #2196f3, #64b5f6)");
            return;
        }

        const id = links[count];
        const data = await fetchScore(id);

        console.log(data.userscoreText);
        score_max += parseInt(data.firstscoreText);
        if (data.userscoreText != "-") {
            score += parseInt(data.userscoreText);
        }
        if (data.userRank == 1) {
            rank_1++;
        }
        else if (data.userRank == 2) {
            rank_2++;
        }
        else if (data.userRank == 3) {
            rank_3++;
        }
        else if (data.userRank <= 10) {
            rank_10++;
        }
        else if (data.userRank <= 40) {
            rank_40++;
        }
        else {
            rank_41++;
        }
        rank_num += data.userRank;
        rank_ave = rank_num / count;

        console.log(data.useraccText);
        const accValue = parseFloat((data.useraccText || "0").replace("%", "").trim());

        if (data.usermodText === "RH") {
            if (accValue == 100) {
                rh_100++;
            } else if (accValue >= 99) {
                rh_99++;
            }
        }
        if (data.useraccText != "-") {
            acc += parseFloat(data.useraccText);
        }
        acc_ave = acc / count;

        $(".score").text(`score:${score}/${score_max} (${Math.round((score / score_max) * 100)}%)`);
        $(".rank_1").text(`1st:${rank_1}`);
        $(".rank_2").text(`2nd:${rank_2}`);
        $(".rank_3").text(`3rd:${rank_3}`);
        $(".rank_10").text(`Top10:${rank_10}`);
        $(".rank_40").text(`Top40:${rank_40}`);
        $(".rank_41").text(`NoRecord:${rank_41}`);
        $(".rank_ave").text(`rank:${Math.round((rank_num / done))}`);
        $(".rh_100").text(`RH 100%:${rh_100}`);
        $(".rh_99").text(`RH 99%:${rh_99}`);
        $(".acc").text(`acc:${Math.round((acc / (done * 100)) * 100)}%`);

        tsv_datas.push(Object.values(data).join(`\t`) + "\n");
        count++;
        setTimeout(process, 0);
    }

    async function processBatch(batchSize) {
        let done = 0;

        while (done < links.length) {
            // 今回のバッチを切り出す
            const batch = links.slice(done, done + batchSize);

            // 複数まとめて取得
            const results = await Promise.all(batch.map(id => fetchScore(id)));

            // 集計処理
            for (const data of results) {
                score_max += parseInt(data.firstscoreText.replace(/,/g, "")) || 0;
                if (data.userscoreText !== "-") {
                    score += parseInt(data.userscoreText.replace(/,/g, "")) || 0;
                }

                if (data.userRank == 1) rank_1++;
                else if (data.userRank == 2) rank_2++;
                else if (data.userRank == 3) rank_3++;
                else if (data.userRank <= 10) rank_10++;
                else if (data.userRank <= 40) rank_40++;
                else rank_41++;

                const accValue = parseFloat((data.useraccText || "0").replace("%", "").trim());
                if (data.usermodText === "RH") {
                    if (accValue == 100) {
                        rh_100++;
                    } else if (accValue >= 99) {
                        rh_99++;
                    } else if (accValue >= 98) {
                        rh_98++;
                    } else {
                        rh_0++;
                    }
                }
                else if (data.usermodText === "DH") {
                    dh_0++;
                } else {
                    nomod_0++;
                }

                rank_num += data.userRank;
                if (data.useraccText !== "-") {
                    acc += parseFloat(data.useraccText);
                }

                // TSV データに追加
                tsv_datas.push(Object.values(data).join("\t"));
            }

            done += batch.length;

            // 進捗更新
            updateProgress(done, links.length);

            // 集計結果表示
            $(".score").text(`score:${score.toLocaleString()}/${score_max.toLocaleString()} (${(score / score_max * 100)}%)`);
            $(".rank_1").text(`1st:${rank_1}`);
            $(".rank_2").text(`2nd:${rank_2}`);
            $(".rank_3").text(`3rd:${rank_3}`);
            $(".rank_10").text(`Top10:${rank_10}`);
            $(".rank_40").text(`Top40:${rank_40}`);
            $(".rank_41").text(`NoRecord:${rank_41}`);
            $(".rank_ave").text(`ave_rank:${Math.round(rank_num / done)}`);
            $(".rh_100").text(`RH 100%:${rh_100}`);
            $(".rh_99").text(`RH 99%:${rh_99}`);
            $(".rh_98").text(`RH 98%:${rh_98}`);
            $(".rh_0").text(`RH any%:${rh_0}`);
            $(".dh_0").text(`DH any%:${dh_0}`);
            $(".nomod_0").text(`- any%:${nomod_0}`);
            $(".acc").text(`ave_acc:${acc / done}%`);

            // 負荷軽減のために小休止
            await new Promise(r => setTimeout(r, 10));
        }

        // まとめて書き込み
        $("#tx").val(tsv_datas.join("\n"));

        alert("全てのリクエストが完了しました");
        $(".progress-bar").css("background", "linear-gradient(90deg, #2196f3, #64b5f6)");
    }

    processBatch(10);
})();
