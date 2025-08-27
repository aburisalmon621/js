javascript:(function(f) {
  var script = document.createElement('script');
  script.src = '//code.jquery.com/jquery-3.2.1.min.js';
  script.onload = function() {
      var $ = jQuery.noConflict(true);
      f($);
  };
  document.body.appendChild(script);
})(function($, undefined) {
  console.log('jQuery: ', $().jquery);
  var nameElement = document.querySelector('.center a b');
  var nameText = nameElement ? nameElement.textContent : 'name not found';

  $(".record").append("<div class='get'></div>");
  $('.get').css('font-size', '12px');
  $(".get").eq(0).append("<p style='font-size : 13px'>cId,title,artist,mode,editor,na,hot,gold,cFirst,dFirst,eFirst,lastUpdate,userrank,useracc,userjudgecount,userscore,usercombo,usertimecombo</p>");
  $(".get").eq(0).append("<textarea id='tx' cols='250' rows='50'></textarea>");
  var jsonData;
  var count = 0;
  var totalpage;
  var links = [];
  var url = "https://m.mugzone.net/page/chart/filter?count=30&mode=7&status=2&page=";

  fetch(url + 0)
    .then(response => response.text())
    .then(html => {
      var parser = new DOMParser();
      var document2 = parser.parseFromString(html, 'text/html');
      jsonDataElement = document2.querySelector('body');
      jsonData = jsonDataElement ? jsonDataElement.textContent : 'jsonData not found';
  
      totalpage = JSON.parse(jsonData).data.total;
  
      const fetchPromises = [];
  
      for (var i = 0; i < totalpage; i++) {
        const fetchPromise = fetch(url + i)
          .then(response => response.text())
          .then(html => {
            var parser2 = new DOMParser();
            var document3 = parser2.parseFromString(html, 'text/html');
            jsonDataElement2 = document3.querySelector('body');
            jsonData2 = jsonDataElement2 ? jsonDataElement2.textContent : 'jsonData not found';
  
            newIds = JSON.parse(jsonData2).data.list.map(function (item) {
              return item.id;
            });
            links.push(...newIds);
          })
          .catch(error => console.error('ページの取得に失敗しました', error));
  
        fetchPromises.push(fetchPromise);
      }
  
      return Promise.all(fetchPromises);
    })
    .then(() => {
      console.log(links);
      sendRequest();
    })
    .catch(error => console.error('ページの取得に失敗しました', error));



  function sendRequest() {
    $("#tx").append("\n");
    if (count >= links.length) {
      alert("全てのリクエストが完了しました");
      return;
    }
  var url = 'https://m.mugzone.net/chart/' + links[count];

  fetch(url)
      .then(response => response.text())
      .then(html => {
          var userrank = 40;
          var parser = new DOMParser();
          var document2 = parser.parseFromString(html, 'text/html');
          for(var i = 0; i <= 41; i++){
              userrank = i;
              findnameElement = document2.querySelector(".score_area .list li:nth-of-type(" + i + ") .name a");
              var findnameText = findnameElement ? findnameElement.textContent : 'findname not found';
              if(findnameText.match(nameText)){
                break;
              }
          }


          var titleElement = document2.querySelector('.title');
          var titleText = titleElement ? titleElement.textContent : 'Title not found';
          var parts = titleText.split('-');
          var targetText = parts[1];
          titleText = targetText.trim();

          var artistElement = document2.querySelector('.artist');
          var artistText = artistElement ? artistElement.textContent : 'Artist not found';

          var modeElement = document2.querySelector('.mode');
          var modeText = modeElement ? modeElement.querySelector('span').textContent : 'Mode not found';
          
          var createdByNameElement = document2.querySelector('.mode a[href^="/accounts/user/"]');
          var createdByNameText = createdByNameElement.textContent;
          
          var cidElement = document2.querySelector('.sub span');
          var cIdText = cidElement ? cidElement.textContent.trim() : 'cID not found';

          var naElement = document2.querySelector('.g_cont2 .num span');
          var naText = naElement ? naElement.textContent.trim() : 'na not found';

          var hotElement = document2.querySelector('.g_cont2 .num:nth-of-type(3) span:nth-of-type(2)');
          var hotText = hotElement ? hotElement.textContent.trim() : 'hot not found';

          var goldElement = document2.querySelector('.g_cont2 .num:nth-of-type(2) span');
          var goldText = goldElement ? goldElement.textContent.trim() : 'gold not found';

          var cFirstElement = document2.querySelector('.g_tmpl_first:nth-of-type(1) .empty');
          var cFirstText = cFirstElement ?  cFirstText = '未' : cFirstText = '済';

          var dFirstElement = document2.querySelector('.g_tmpl_first:nth-of-type(3) .empty');
          var dFirstText = dFirstElement ?  dFirstText = '未' : dFirstText = '済';

          var eFirstElement = document2.querySelector('.g_tmpl_first:nth-of-type(2) .empty');
          var eFirstText = eFirstElement ?  eFirstText = '未' : eFirstText = '済';

          var lastUpdateElement = document2.querySelector('.sub span:nth-of-type(4)');
          var lastUpdateText = lastUpdateElement ? lastUpdateElement.textContent : 'lastUpdate not found';

          /* */

          var firstnameElement = document2.querySelector('.score_area li:nth-of-type(1) .name a');
          var firstnameText = firstnameElement ? firstnameElement.textContent : '-';
          
          var firstmodElement = document2.querySelector('.score_area li:nth-of-type(1) .mod i');
          var firstmodText = "-";
          if(firstmodElement){
            if(firstmodElement.classList.contains('g_mod_4')){
              firstmodText = "DH";
            } else if(firstmodElement.classList.contains('g_mod_5')){
              firstmodText = "RH";
            }
          }

          var firstaccElement = document2.querySelector('.score_area li:nth-of-type(1) .acc em');
          var firstaccText = firstaccElement ? firstaccElement.textContent : '-';

          var firstjudgecountElement = document2.querySelector('.score_area li:nth-of-type(1)');
          var firstjudgecountText = firstjudgecountElement ? firstjudgecountElement.getAttribute('title') : '-';

          var firstscoreElement = document2.querySelector('.score_area li:nth-of-type(1) .score');
          var firstscoreText = firstscoreElement ? firstscoreElement.textContent : '-';

          var firstcomboElement = document2.querySelector('.score_area li:nth-of-type(1) .combo');
          var firstcomboText = firstcomboElement ? firstcomboElement.textContent : '-';

          var firsttimeElement = document2.querySelector('.score_area li:nth-of-type(1) .time');
          var firsttimeText = firsttimeElement ? firsttimeElement.textContent : '-';
          /* */
          var usermodElement = document2.querySelector('.score_area li:nth-of-type(' + userrank + ') .mod i');
          var usermodText = "-";
          if(usermodElement){
            if(usermodElement.classList.contains('g_mod_4')){
              usermodText = "DH";
            } else if(usermodElement.classList.contains('g_mod_5')){
              usermodText = "RH";
            }
          }

          var useraccElement = document2.querySelector('.score_area li:nth-of-type(' + userrank + ') .acc em');
          var useraccText = useraccElement ? useraccElement.textContent : '-';

          var userjudgecountElement = document2.querySelector('.score_area li:nth-of-type(' + userrank + ')');
          var userjudgecountText = userjudgecountElement ? userjudgecountElement.getAttribute('title') : '-';

          var userscoreElement = document2.querySelector('.score_area li:nth-of-type(' + userrank + ') .score');
          var userscoreText = userscoreElement ? userscoreElement.textContent : '-';

          var usercomboElement = document2.querySelector('.score_area li:nth-of-type(' + userrank + ') .combo');
          var usercomboText = usercomboElement ? usercomboElement.textContent : '-';

          var usertimeElement = document2.querySelector('.score_area li:nth-of-type(' + userrank + ') .time');
          var usertimeText = usertimeElement ? usertimeElement.textContent : '-';


        $("#tx").append(cIdText + ";;;");
        $("#tx").append(titleText + ";;;");
        $("#tx").append(artistText + ";;;");
        $("#tx").append(modeText + ";;;");
        $("#tx").append(createdByNameText + ";;;");
        $("#tx").append(naText + ";;;");
        $("#tx").append(hotText + ";;;");
        $("#tx").append(goldText + ";;;");
        $("#tx").append(cFirstText + ";;;");
        $("#tx").append(dFirstText + ";;;");
        $("#tx").append(eFirstText + ";;;");
        $("#tx").append(lastUpdateText + ";;;");
        $("#tx").append(firstnameText + ";;;");
        $("#tx").append(firstmodText + ";;;");
        $("#tx").append(firstaccText + ";;;");
        $("#tx").append(firstjudgecountText + ";;;");
        $("#tx").append(firstscoreText + ";;;");
        $("#tx").append(firstcomboText + ";;;");
        $("#tx").append(firsttimeText + ";;;");
        $("#tx").append(userrank + ";;;");
        $("#tx").append(usermodText + ";;;");
        $("#tx").append(useraccText + ";;;");
        $("#tx").append(userjudgecountText + ";;;");
        $("#tx").append(userscoreText + ";;;");
        $("#tx").append(usercomboText + ";;;");
        $("#tx").append(usertimeText + ";;;");

          count++;
          setTimeout(sendRequest, 0);
      })
      
      .catch(error => console.error('ページの取得に失敗しました', error));
    
  }
  
});
