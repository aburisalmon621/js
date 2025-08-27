javascript: (function (f) {
  var script = document.createElement('script');
  script.src = '//code.jquery.com/jquery-3.2.1.min.js';
  script.onload = function () {
    var $ = jQuery.noConflict(true);
    f($);
  };
  document.body.appendChild(script);
})(function ($, undefined) {
  console.log('jQuery: ', $().jquery);
  var nameElement = document.querySelector('.center a b');
  var nameText = nameElement ? nameElement.textContent : 'name not found';

  $(".g_wiki").append("<div class='get'></div>");
  $('.get').css('font-size', '12px');
  $(".get").eq(0).append("<textarea id='tx' cols='200' rows='50'></textarea>");
  var currentPageUrl = window.location.href;
  var titleElement = document.querySelector('.title');
  var titleText = titleElement ? titleElement.textContent : 'Title not found';
  var parts = titleText.split(' - ');
  var targetText = parts[1];
  titleText = targetText.trim();
  $("#tx").append("|[ " + currentPageUrl + " " + titleText + " ]|\n");
  for (var i = 0; i < 100; i++) {
    var chartElement = document.querySelector('.item:nth-of-type(' + i + ') a');
    var chartText = chartElement ? chartElement.textContent : 'Title not found';
    var chartUrl = chartElement ? chartElement.getAttribute('href') : 'Url not found';
    if (chartText.match('Title not found')) {
      continue;
    }
    $("#tx").append("[ https://m.mugzone.net" + chartUrl + " " + chartText + " ]|\n");
    i++;
  };

});