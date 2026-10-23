(function(){
  var t=document.querySelector('.nav-toggle'),l=document.querySelector('.nav-links');
  if(!t||!l)return;
  t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);});
  l.addEventListener('click',function(e){if(e.target.tagName==='A'){l.classList.remove('open');t.setAttribute('aria-expanded','false');}});
})();
