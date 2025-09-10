javascript:(async function () {
    /* jQuery を読み込む */
    const load_jquery = () =>
        new Promise(resolve => {
            const script = document.createElement("script");
            script.src = "//code.jquery.com/jquery-3.2.1.min.js";
            script.onload = () => resolve(jQuery.noConflict(true));
            document.body.appendChild(script);
        });

    const $ = await load_jquery();
    console.log("jQuery:", $().jquery);

    /* ユーザー入力 */
    const mode_datas = ["Key", "Step", "Dj", "Catch", "Pad", "Taiko", "Ring", "Slide", "Live"];
    const name_text = prompt("ユーザー1の名前を入力してください:", "hazeiro");
    const name_text2 = prompt("ユーザー2の名前を入力してください:", "");
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
  <div class="get" style="font-size:14px; padding:15px; border:1px solid #ccc; border-radius:12px; margin:15px 0;
      box-shadow:0 2px 6px rgba(0,0,0,0.15); background:#fafafa;">
    <h2 style="font-size:18px; margin:0 0 10px; padding-bottom:5px; border-bottom:2px solid #4caf50; color:#333;">
      Player Data<br>${mode_datas[mode]} ${key}</h2>
    
    <div class="data" style="margin-bottom:10px;">
      <div class="score" style="font-weight:bold;margin-bottom:10px;"></div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rank_1"></div><div class="rank_2"></div><div class="rank_3"></div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rank_10"></div><div class="rank_40"></div><div class="rank_41"></div>
      </div>
      <div class="rank_ave" style="margin-bottom:10px;"></div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rh_100"></div><div class="rh_99"></div><div class="rh_98"></div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:10px;">
        <div class="rh_0"></div><div class="dh_0"></div><div class="nomod_0"></div>
      </div>
      <div class="acc"></div><div class="acc_ave"></div>
    </div>

    <!-- 開閉式 TSV 出力結果 -->
    <div style="border-top:1px solid #ccc; padding-top:10px;">
      <div id="toggle_header" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
        <span style="font-size:14px; font-weight:bold; color:#333;">text_data</span>
        <span id="toggle_btn" style="font-size:18px; user-select:none;">▼</span>
      </div>
      <div id="toggle_content" style="margin-top:10px; display:none;">
        <textarea id="tx" rows="20" style="width:100%; font-family:monospace; font-size:12px;
          border-radius:8px; border:1px solid #ccc; padding:5px; box-sizing:border-box;"></textarea>
      </div>
    </div>
  </div>`);

    /* 開閉処理 */
    $("#toggle_header").on("click", function () {
        const content = $("#toggle_content");
        const btn = $("#toggle_btn");
        if (content.is(":visible")) { content.slideUp(200); btn.text("▼"); }
        else { content.slideDown(200); btn.text("▲"); }
    });

    /* 進捗バー */
    $("body").append(`
    <div class="progress_fixed" style="position:fixed; bottom:0; left:0; width:100%; height:30px;
      background:#eee; border-top:1px solid #ccc; z-index:9999;">
      <div class="progress_bar" style="height:100%; width:0%;
        background:linear-gradient(90deg, #4caf50, #81c784); transition:width 0.3s;"></div>
      <span class="progress_text" style="position:absolute; top:0; left:50%;
        transform:translateX(-50%); font-size:13px; line-height:30px; color:#000; font-weight:bold;">0%</span>
    </div>`);

    const url_base = `https://m.mugzone.net/page/chart/filter?count=30&mode=${mode}&status=2&key=${key}&page=`;

    /* 共通関数 */
    const parse_html = html => new DOMParser().parseFromString(html, "text/html");
    const q = (doc, selector) => doc.querySelector(selector)?.textContent?.trim() || "-";

    /* Chart ID 一覧取得 */
    async function fetchChartIds() {
        const first_html = await (await fetch(url_base + 0)).text();
        const first_doc = parse_html(first_html);
        const total_page = JSON.parse(first_doc.body.textContent).data.total;

        const promises = Array.from({ length: total_page }, async (_, i) => {
            const html = await (await fetch(url_base + i)).text();
            const doc = parse_html(html);
            return JSON.parse(doc.body.textContent).data.list.map(item => item.id);
        });

        const results = await Promise.all(promises);
        links = results.flat();
    }

    async function fetchScore(id) {
        const url = `https://m.mugzone.net/chart/${id}`;
        const html = await (await fetch(url)).text();
        const doc = parse_html(html);

        const mode_raw = q(doc, ".mode span");
        let diff_name = "-";
        let level = null;
        const match = mode_raw.match(/^(.+?) Lv\.(\d+)/);
        if (match) {
            diff_name = match[1].trim();
            level = parseInt(match[2], 10);
        }

        const getRank = (target_name) => {
            for (let i = 1; i <= 41; i++) {
                const name = q(doc, `.score_area .list li:nth-of-type(${i}) .name a`);
                if (name.match(target_name)) return i;
            }
            return 41;
        };

        let user_rank = getRank(name_text);
        let user_rank2 = getRank(name_text2);

        /* ====== 1位の情報 ====== */
        const first_name_text = q(doc, '.score_area li:nth-of-type(1) .name a');
        let first_mod_text = "-";
        const first_mod_element = doc.querySelector('.score_area li:nth-of-type(1) .mod i');
        if (first_mod_element) {
            if (first_mod_element.classList.contains('g_mod_4')) first_mod_text = "DH";
            else if (first_mod_element.classList.contains('g_mod_5')) first_mod_text = "RH";
        }
        const first_acc_text = q(doc, '.score_area li:nth-of-type(1) .acc em');
        const first_judge_count_text = doc.querySelector('.score_area li:nth-of-type(1)')?.getAttribute('title') || '-';
        const first_score_text = q(doc, '.score_area li:nth-of-type(1) .score');
        const first_combo_text = q(doc, '.score_area li:nth-of-type(1) .combo');
        const first_time_text = q(doc, '.score_area li:nth-of-type(1) .time');

        /* ====== ユーザー1の情報 ====== */
        let user_mod_text = "-";
        const user_mod_element = doc.querySelector(`.score_area li:nth-of-type(${user_rank}) .mod i`);
        if (user_mod_element) {
            if (user_mod_element.classList.contains('g_mod_4')) user_mod_text = "DH";
            else if (user_mod_element.classList.contains('g_mod_5')) user_mod_text = "RH";
        }
        const user_acc_text = q(doc, `.score_area li:nth-of-type(${user_rank}) .acc em`);
        const user_judge_count_text = doc.querySelector(`.score_area li:nth-of-type(${user_rank})`)?.getAttribute('title') || '-';
        const user_score_text = q(doc, `.score_area li:nth-of-type(${user_rank}) .score`);
        const user_combo_text = q(doc, `.score_area li:nth-of-type(${user_rank}) .combo`);
        const user_time_text = q(doc, `.score_area li:nth-of-type(${user_rank}) .time`);
        if (id == 39494) user_rank -= 1;
        if (user_score_text.match(first_score_text)) user_rank = 1;

        /* ====== ユーザー2の情報 ====== */
        let user_mod_text2 = "-";
        const user_mod_element2 = doc.querySelector(`.score_area li:nth-of-type(${user_rank2}) .mod i`);
        if (user_mod_element2) {
            if (user_mod_element2.classList.contains('g_mod_4')) user_mod_text2 = "DH";
            else if (user_mod_element2.classList.contains('g_mod_5')) user_mod_text2 = "RH";
        }
        const user_acc_text2 = q(doc, `.score_area li:nth-of-type(${user_rank2}) .acc em`);
        const user_judge_count_text2 = doc.querySelector(`.score_area li:nth-of-type(${user_rank2})`)?.getAttribute('title') || '-';
        const user_score_text2 = q(doc, `.score_area li:nth-of-type(${user_rank2}) .score`);
        const user_combo_text2 = q(doc, `.score_area li:nth-of-type(${user_rank2}) .combo`);
        const user_time_text2 = q(doc, `.score_area li:nth-of-type(${user_rank2}) .time`);
        if (id == 39494) user_rank2 -= 1;
        if (user_score_text2.match(first_score_text)) user_rank2 = 1;

        return {
            c_id: id,
            title: q(doc, ".title").split(" - ")[1] || "Title not found",
            artist: q(doc, ".artist"),
            diff_name,
            level,
            editor: q(doc, '.mode a[href^="/accounts/user/"]'),
            na: q(doc, ".g_cont2 .num span"),
            hot: q(doc, ".g_cont2 .num:nth-of-type(3) span:nth-of-type(2)"),
            gold: q(doc, ".g_cont2 .num:nth-of-type(2) span"),
            c_first: doc.querySelector(".g_tmpl_first:nth-of-type(1) .empty") ? "未" : "済",
            d_first: doc.querySelector(".g_tmpl_first:nth-of-type(3) .empty") ? "未" : "済",
            e_first: doc.querySelector(".g_tmpl_first:nth-of-type(2) .empty") ? "未" : "済",
            last_update: q(doc, ".sub span:nth-of-type(4)"),
            // 1位情報
            first_name_text,
            first_mod_text,
            first_acc_text,
            first_judge_count_text,
            first_score_text,
            first_combo_text,
            first_time_text,
            // ユーザー1情報
            user_rank,
            user_mod_text,
            user_acc_text,
            user_judge_count_text,
            user_score_text,
            user_combo_text,
            user_time_text,
            // ユーザー2情報
            user_rank2,
            user_mod_text2,
            user_acc_text2,
            user_judge_count_text2,
            user_score_text2,
            user_combo_text2,
            user_time_text2
        };
    }

    function updateProgress(current, total) {
        const percent = Math.round((current / total) * 100);
        $(".progress_bar").css("width", percent + "%");
        $(".progress_text").text(`${current}/${total} (${percent}%)`);
    }

    await fetchChartIds();
    console.log("取得したリンク:", links);

    async function processBatch(batch_size) {
        let done = 0;

        while (done < links.length) {
            const batch = links.slice(done, done + batch_size);
            const results = await Promise.all(batch.map(id => fetchScore(id)));

            for (const data of results) {
                score_max += parseInt(data.first_score_text.replace(/,/g, "")) || 0;
                if (data.user_score_text !== "-") {
                    score += parseInt(data.user_score_text.replace(/,/g, "")) || 0;
                }

                if (data.user_rank == 1) rank_1++;
                else if (data.user_rank == 2) rank_2++;
                else if (data.user_rank == 3) rank_3++;
                else if (data.user_rank <= 10) rank_10++;
                else if (data.user_rank <= 40) rank_40++;
                else rank_41++;

                const acc_value = parseFloat((data.user_acc_text || "0").replace("%", "").trim());
                if (data.user_mod_text === "RH") {
                    if (acc_value == 100) rh_100++;
                    else if (acc_value >= 99) rh_99++;
                    else if (acc_value >= 98) rh_98++;
                    else rh_0++;
                }
                else if (data.user_mod_text === "DH") {
                    dh_0++;
                } else {
                    nomod_0++;
                }

                rank_num += data.user_rank;
                if (data.user_acc_text !== "-") {
                    acc += parseFloat(data.user_acc_text);
                }

                tsv_datas.push(Object.values(data).join("\t"));
            }

            done += batch.length;
            updateProgress(done, links.length);

            $(".score").text(`score:${score.toLocaleString()}/${score_max.toLocaleString()} (${Math.round((score / score_max) * 100)}%)`);
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
            $(".nomod_0").text(`nomod any%:${nomod_0}`);
            $(".acc").text(`ave_acc:${Math.round(acc / done)}%`);

            await new Promise(r => setTimeout(r, 10));
        }

        $("#tx").val(tsv_datas.join("\n"));
        alert("全てのリクエストが完了しました");
        $(".progress_bar").css("background", "linear-gradient(90deg, #2196f3, #64b5f6)");
    }

    processBatch(10);
})();
