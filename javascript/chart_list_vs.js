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
    const nameText = prompt("ユーザー1の名前を入力してください:", "hazeiro");
    const nameText2 = prompt("ユーザー2の名前を入力してください:", "");
    const mode = prompt("モードを入力してください [0:Key, 1:Step, 2:Dj, 3:Catch, 4:Pad, 5:Taiko, 6:Ring, 7:Slide, 8:Live]:", "0");
    const key = prompt("キーを入力してください:", "");

    let count = 0;
    let links = [];
    let score_max = 0;
    let score = 0;
    let rank_1 = 0;
    let rank_2 = 0;
    let rank_3 = 0;
    let rank_10 = 0;
    let rank_40 = 0;
    let rank_num = 0;
    let rank_ave = 0;
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
    ">Player Data</h2>
    
    <div class="data" style="
      display:grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap:8px;
      margin-bottom:10px;
    ">
      <div class="score" style="font-weight:bold; color:#2e7d32;"></div>
      <div class="rank_1"></div>
      <div class="rank_2"></div>
      <div class="rank_3"></div>
      <div class="rank_10"></div>
      <div class="rank_40"></div>
      <div class="rank_ave"></div>
      <div class="acc"></div>
      <div class="acc_ave"></div>
    </div>

    <textarea id="tx" cols="250" rows="30" style="
      width:100%;
      font-family:monospace;
      font-size:12px;
      border-radius:8px;
      border:1px solid #ccc;
      padding:5px;
      box-sizing:border-box;
    "></textarea>
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
        if (userscoreText2.match(firstscoreText)) userRank2 = 1;

        return {
            cId: q(doc, ".sub span"),
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
            updateProgress(links.length, links.length);
            $(".progress-bar").css("background", "linear-gradient(90deg, #2196f3, #64b5f6)");
            return;
        }

        const id = links[count];
        const data = await fetchScore(id);

        score_max += parseInt(data.firstscoreText);
        score += parseInt(data.userscoreText);
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
        rank_num += data.userRank;
        rank_ave = rank_num / count;
        acc += parseFloat(data.useraccText);
        acc_ave = acc / count;

        $(".score").text(`score:${score}/${score_max} (${Math.round((score / score_max) * 100)}%)`);
        $(".rank_1").text(`1st:${rank_1}`);
        $(".rank_2").text(`2nd:${rank_2}`);
        $(".rank_3").text(`3rd:${rank_3}`);
        $(".rank_10").text(`10th:${rank_10}`);
        $(".rank_40").text(`40th:${rank_40}`);
        $(".rank_ave").text(`rank:${Math.round((rank_num / links.length))}`);
        $(".acc").text(`acc:${Math.round((acc / (links.length * 100)) * 100)}%`);

        $("#tx").append(Object.values(data).join(`\t`) + "\n");
        count++;
        setTimeout(process, 0);
    }

    process();
})();
