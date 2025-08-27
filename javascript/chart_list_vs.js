javascript:(async function () {
  /** ========================
   * jQuery を読み込む
   * ======================== */
  const loadJQuery = () =>
    new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "//code.jquery.com/jquery-3.2.1.min.js";
      script.onload = () => resolve(jQuery.noConflict(true));
      document.body.appendChild(script);
    });

  const $ = await loadJQuery();
  console.log("jQuery:", $().jquery);

  /** ========================
   * 初期設定
   * ======================== */
  const nameText = "hazeiro";
  const nameText2 = "niniin";
  const mode = "0";
  const key = "7k";
  let count = 0;
  let links = [];

  /** ========================
   * UI 準備
   * ======================== */
  $(".get").remove();
  $(".body").append(`
    <div class="get" style="font-size:12px; padding:10px; border:1px solid #ccc; margin:10px 0;">
      <p style="font-size: 13px; margin:0 0 5px;">
        cId,title,artist,mode,editor,na,hot,gold,
        cFirst,dFirst,eFirst,lastUpdate,
        userrank,useracc,userjudgecount,userscore,usercombo,usertimecombo
      </p>
      <textarea id="tx" cols="250" rows="30" style="width:100%;"></textarea>
    </div>
  `);

  // ページ下部に固定するプログレスバー
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

  /** ========================
   * 共通関数
   * ======================== */
  const parseHTML = html => new DOMParser().parseFromString(html, "text/html");
  const q = (doc, selector) => doc.querySelector(selector)?.textContent?.trim() || "-";

  /** Chart ID 一覧を取得 */
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

  /** スコアデータ取得 */
  async function fetchScore(id) {
    const url = `https://m.mugzone.net/chart/${id}`;
    const html = await (await fetch(url)).text();
    const doc = parseHTML(html);

    const getRank = (targetName) => {
      for (let i = 1; i <= 41; i++) {
        const name = q(doc, `.score_area .list li:nth-of-type(${i}) .name a`);
        if (name.match(targetName)) return i;
      }
      return -1;
    };

    const userRank = getRank(nameText);
    const userRank2 = getRank(nameText2);

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
      userRank,
      userRank2,
    };
  }

  /** ========================
   * プログレスバー更新
   * ======================== */
  function updateProgress(current, total) {
    const percent = Math.round((current / total) * 100);
    $(".progress-bar").css("width", percent + "%");
    $(".progress-text").text(`${current}/${total} (${percent}%)`);
  }

  /** ========================
   * メイン処理
   * ======================== */
  await fetchChartIds();
  console.log("取得したリンク:", links);

  async function process() {
    updateProgress(count, links.length);

    if (count >= links.length) {
      alert("全てのリクエストが完了しました");
      updateProgress(links.length, links.length);
      $(".progress-bar").css("background", "linear-gradient(90deg, #2196f3, #64b5f6)"); // 完了時に青に変化
      return;
    }

    const id = links[count];
    const data = await fetchScore(id);

    $("#tx").append(Object.values(data).join(`\t`) + "\n");
    count++;
    setTimeout(process, 0);
  }

  process();
})();
