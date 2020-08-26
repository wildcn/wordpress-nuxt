import Vue from 'vue';


function Message (options) {
  if (window.ELEMENT) {
    window.ELEMENT.Message(options);
  }
}
function initCopyBtnOnLoad (el) {
  var dom = document.createElement('div');
  dom.className = 'icon-copy';
  dom.onclick = function (el) {
    selectText(this.parentNode);
  }
  el.parentNode.appendChild(dom);
}
function selectText (element) {
  if (document.body.createTextRange) {
    //createTextRange是用在IE中的
    var range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
    Message({ message: '复制成功', type: 'success' })
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy")
    Message({ message: '复制成功', type: 'success' })
  } else {
    Message({ message: '复制失败', type: 'warning' })
  }
}
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
    hljs.initLineNumbersOnLoad();
    initCopyBtnOnLoad(block);
  })

})

