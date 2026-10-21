/* gallery.js - Google Images style viewer.
   Click a photo: a panel slides in on the RIGHT showing that photo large, with its title,
   previous / next arrows, close (X), Open / Share / Save buttons and a thumbnail strip.
   The gallery stays visible on the left and the picked photo is outlined.
   Phones: the panel fills the screen. Close with X, Esc, or the browser Back button.
   Self-contained: it injects its own CSS, so it works with any Gaming.css. */
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
  if (!imgs.length) return;
 
  var style = document.createElement('style');
  style.textContent = [
    '.gallery img{cursor:pointer;transition:outline-color .15s,box-shadow .15s}',
    '.gallery img.gv-sel{outline:3px solid #8ab4f8;outline-offset:-3px;box-shadow:0 0 0 3px rgba(138,180,248,.35)}',
    'body{transition:padding-right .25s ease}',
    'body.gv-open{padding-right:min(46vw,720px)}',
    '#gv-panel{position:fixed;top:0;right:0;bottom:0;width:min(46vw,720px);z-index:2147483000;',
    ' background:#202124;color:#e8eaed;font-family:Arial,Helvetica,sans-serif;display:flex;flex-direction:column;',
    ' transform:translateX(105%);transition:transform .25s ease;box-shadow:-6px 0 24px rgba(0,0,0,.35);overflow-y:auto}',
    '#gv-panel.open{transform:translateX(0)}',
    '#gv-panel *{box-sizing:border-box}',
    '.gv-head{display:flex;align-items:center;gap:10px;padding:14px 16px;position:sticky;top:0;background:#202124;z-index:2}',
    '.gv-logo{width:34px;height:34px;border-radius:50%;background:#43197a;color:#fff;display:flex;align-items:center;',
    ' justify-content:center;font-weight:bold;font-size:13px;flex:none}',
    '.gv-site{font-size:16px;font-weight:bold;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.gv-icon{background:none;border:0;color:#e8eaed;width:40px;height:40px;border-radius:50%;font-size:24px;',
    ' cursor:pointer;line-height:1;padding:0;flex:none}',
    '.gv-icon:hover,.gv-icon:focus{background:rgba(255,255,255,.14);outline:none}',
    '.gv-stage{margin:0 16px;border-radius:14px;overflow:hidden;background:#111;display:flex;justify-content:center}',
    '.gv-main{display:block;max-width:100%;max-height:62vh;width:auto;height:auto;object-fit:contain}',
    '.gv-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 6px}',
    '.gv-title{font-size:18px;margin:0;font-weight:normal}',
    '.gv-visit{background:#8ab4f8;color:#202124;text-decoration:none;font-weight:bold;font-size:14px;',
    ' padding:10px 18px;border-radius:999px;white-space:nowrap}',
    '.gv-visit:hover{background:#aecbfa}',
    '.gv-actions{display:flex;gap:10px;padding:10px 16px}',
    '.gv-btn{flex:1;background:#303134;color:#e8eaed;border:0;border-radius:999px;padding:12px;font-size:14px;',
    ' font-weight:bold;cursor:pointer;text-align:center;text-decoration:none;font-family:inherit}',
    '.gv-btn:hover,.gv-btn:focus{background:#3c4043;outline:none}',
    '.gv-more{padding:8px 16px 4px;font-size:14px;color:#9aa0a6}',
    '.gv-thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px 16px 24px}',
    '.gv-thumbs img{width:100%;height:110px;object-fit:cover;border-radius:10px;cursor:pointer;display:block;',
    ' border:3px solid transparent}',
    '.gv-thumbs img.gv-cur{border-color:#8ab4f8}',
    '@media (max-width:900px){',
    ' body.gv-open{padding-right:0;overflow:hidden}',
    ' #gv-panel{width:100vw}',
    ' .gv-main{max-height:55vh}',
    '}'
  ].join('');
  document.head.appendChild(style);
 
  var panel = document.createElement('aside');
  panel.id = 'gv-panel';
  panel.setAttribute('aria-label', 'Photo viewer');
  panel.innerHTML =
    '<div class="gv-head">' +
      '<div class="gv-logo">KW</div><div class="gv-site">Knightwolf</div>' +
      '<button class="gv-icon gv-prev" aria-label="Previous photo">&#8249;</button>' +
      '<button class="gv-icon gv-next" aria-label="Next photo">&#8250;</button>' +
      '<button class="gv-icon gv-close" aria-label="Close">&#10005;</button>' +
    '</div>' +
    '<div class="gv-stage"><img class="gv-main" alt=""></div>' +
    '<div class="gv-row"><h3 class="gv-title"></h3><a class="gv-visit" target="_blank" rel="noopener">Open &#8250;</a></div>' +
    '<div class="gv-actions"><button class="gv-btn gv-share">Share</button>' +
    '<a class="gv-btn gv-save" download>Save</a></div>' +
    '<div class="gv-more">More photos</div><div class="gv-thumbs"></div>';
  document.body.appendChild(panel);
 
  var q = function (s) { return panel.querySelector(s); };
  var main = q('.gv-main'), title = q('.gv-title'), visit = q('.gv-visit'),
      save = q('.gv-save'), share = q('.gv-share'), thumbs = q('.gv-thumbs'), cur = 0, isOpen = false;
 
  var thumbEls = imgs.map(function (img, i) {
    var t = document.createElement('img');
    t.src = img.src; t.alt = img.alt; t.loading = 'lazy';
    t.addEventListener('click', function () { show(i); });
    thumbs.appendChild(t);
    return t;
  });
 
  function nameOf(i) {
    var fc = imgs[i].parentNode.querySelector('figcaption');
    return fc ? fc.textContent : (imgs[i].alt || 'Photo');
  }
 
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    var img = imgs[cur];
    main.src = img.src; main.alt = img.alt;
    title.textContent = nameOf(cur);
    visit.href = img.src;
    save.href = img.src;
    save.setAttribute('download', decodeURIComponent(img.src.split('/').pop()));
    imgs.forEach(function (x, k) { x.classList.toggle('gv-sel', k === cur); });
    thumbEls.forEach(function (x, k) { x.classList.toggle('gv-cur', k === cur); });
    panel.scrollTop = 0;
    if (isOpen && window.innerWidth > 900) {
      try { img.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
    }
  }
 
  function openAt(i) {
    show(i);
    if (!isOpen) {
      isOpen = true;
      panel.classList.add('open');
      document.body.classList.add('gv-open');
      try { history.pushState({ gv: 1 }, ''); } catch (e) {}
    }
  }
  function hide() {
    isOpen = false;
    panel.classList.remove('open');
    document.body.classList.remove('gv-open');
    imgs.forEach(function (x) { x.classList.remove('gv-sel'); });
  }
  function close() {
    if (!isOpen) return;
    if (history.state && history.state.gv) { try { history.back(); return; } catch (e) {} }
    hide();
  }
  window.addEventListener('popstate', function () { if (isOpen) hide(); });
 
  imgs.forEach(function (img, i) {
    img.tabIndex = 0; img.setAttribute('role', 'button');
    img.addEventListener('click', function () { openAt(i); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter') openAt(i); });
  });
 
  q('.gv-close').onclick = close;
  q('.gv-prev').onclick = function () { show(cur - 1); };
  q('.gv-next').onclick = function () { show(cur + 1); };
 
  share.onclick = function () {
    var url = imgs[cur].src, data = { title: nameOf(cur), url: url };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { share.textContent = 'Link copied!'; setTimeout(function () { share.textContent = 'Share'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
    else done();
  };
 
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
})();
