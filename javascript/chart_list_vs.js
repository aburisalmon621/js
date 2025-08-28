javascript:(async function () {
    /* jQuery を読み込む */
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
    let buffer = []; // テキストエリア用のバッファ

    // 集計用
    let score_max = 0;
    let score = 0;
    let rank_1 = 0;
    let rank_2 = 0;
    let rank_3 = 0;
    let rank_10 = 0;
    let rank_40 = 0;
    let rank_41 = 0;
    let rank_num = 0;
    let acc = 0;

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
    
    <div class="data" style="margin-bottom:10px;">
      <div class="score" style="font-weight:bold;"></div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;">
        <div class="rank_1"></div>
        <div class="rank_2"></div>
        <div class="rank_3"></div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;">
        <div class="rank_10"></div>
        <div class="rank_40"></div>
        <div class="rank_41"></div>
      </div>
      <div class="rank_ave"></div>
      <div class="acc"></div>
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

        let userRank = getRank(nameText);
        let userRank2 = getRank(nameText2);

        const firstscoreText = q(doc, '.score_area li:nth-of-type(1) .score');
        const userscoreText = q(doc, `.score_area li:nth-of-type(${userRank}) .score`);
        const useraccText = q(doc, `.score_area li:nth-of-type(${userRank}) .acc em`);

        // 集計
        score_max += parseInt(firstscoreText);
        if (userscoreText !== "-") score += parseInt(userscoreText);
        if (userRank == 1) rank_1++;
        else if (userRank == 2) rank_2++;
        else if (userRank == 3) rank_3++;
        else if (userRank <= 10) rank_10++;
        else if (userRank <= 40) rank_40++;
        else rank_41++;
        rank_num += userRank;
        if (useraccText !== "-") acc += parseFloat(useraccText);

        return Object.values({
            id,
            title: q(doc, ".title").split(" - ")[1] || "Title not found",
            artist: q(doc, ".artist"),
            userRank,
            userscoreText,
            useraccText,
            userRank2
        }).join("\t");
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
            // バッファを一括出力
            $("#tx").val(buffer.join("\n"));

            // 集計結果更新
            $(".score").text(`score:${score}/${score_max} (${Math.round((score / score_max) * 100)}%)`);
            $(".rank_1").text(`1st:${rank_1}`);
            $(".rank_2").text(`2nd:${rank_2}`);
            $(".rank_3").text(`3rd:${rank_3}`);
            $(".rank_10").text(`Top10:${rank_10}`);
            $(".rank_40").text(`Top40:${rank_40}`);
            $(".rank_41").text(`NoRecord:${rank_41}`);
            $(".rank_ave").text(`rank:${Math.round(rank_num / links.length)}`);
            $(".acc").text(`acc:${Math.round((acc / links.length))}%`);

            alert("全てのリクエストが完了しました");
            $(".progress-bar").css("background", "linear-gradient(90deg, #2196f3, #64b5f6)");
            return;
        }

        const id = links[count];
        const line = await fetchScore(id);
        buffer.push(line); // バッファに追加

        count++;
        setTimeout(process, 0);
    }

    process();
})();
