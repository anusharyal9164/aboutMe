// Full-screen photo viewer: click a photo -> page goes dark and the photo pops up in front.
// Close with the X (top right), Esc, clicking the dark area, or the browser Back button.
// Arrow keys / on-screen arrows move between photos. Carries its own styles.
<script>
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
  if (!imgs.length) return;

  var css = document.createElement('style');
  css.textContent =
    '.gallery img{cursor:zoom-in}' +
    '#lightbox{position:fixed!important;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;' +
    'z-index:2147483647;background:rgba(0,0,0,.88);display:none;align-items:center;' +
    'justify-content:center;flex-direction:column;margin:0;padding:0}' +
    '#lightbox.open{display:flex}' +
    '#lightbox img{max-width:94vw;max-height:84vh;width:auto;height:auto;object-fit:contain;' +
    'border-radius:6px;cursor:default;display:block;box-shadow:0 8px 40px rgba(0,0,0,.6)}' +
    '#lightbox .lb-caption{color:#eceaea;margin-top:12px;font-style:italic;font-family:Georgia,serif}' +
    '#lightbox button{position:absolute;background:rgba(255,255,255,.18);color:#fff;border:0;' +
    'font-size:2rem;width:52px;height:52px;border-radius:50%;cursor:pointer;line-height:1;padding:0}' +
    '#lightbox button:hover,#lightbox button:focus{background:rgba(255,255,255,.4)}' +
    '#lightbox .lb-close{top:18px;right:18px;width:48px;height:48px;font-size:1.8rem;' +
    'border:2px solid rgba(255,255,255,.7)}' +
    '#lightbox .lb-prev{left:12px;top:50%;transform:translateY(-50%)}' +
    '#lightbox .lb-next{right:12px;top:50%;transform:translateY(-50%)}';
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.id = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lb-close" aria-label="Close">&#10005;</button>' +
    '<button class="lb-prev" aria-label="Previous">&#8249;</button>' +
    '<img alt=""><div class="lb-caption"></div>' +
    '<button class="lb-next" aria-label="Next">&#8250;</button>';
  document.body.appendChild(box);
  var big = box.querySelector('img'), cap = box.querySelector('.lb-caption'), cur = 0;

  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    big.src = imgs[cur].src; big.alt = imgs[cur].alt;
    var fc = imgs[cur].parentNode.querySelector('figcaption');
    cap.textContent = fc ? fc.textContent : '';
  }
  function hide() { box.classList.remove('open'); document.body.style.overflow = ''; }
  function open(i) {
    show(i); box.classList.add('open'); document.body.style.overflow = 'hidden';
    try { history.pushState({ lb: 1 }, ''); } catch (e) {}
  }
  function close() {
    if (!box.classList.contains('open')) return;
    if (history.state && history.state.lb) { try { history.back(); return; } catch (e) {} }
    hide();
  }
  window.addEventListener('popstate', hide);

  imgs.forEach(function (img, i) {
    img.tabIndex = 0; img.setAttribute('role', 'button');
    img.addEventListener('click', function () { open(i); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(i); });
  });
  box.querySelector('.lb-close').onclick = close;
  box.querySelector('.lb-prev').onclick = function (e) { e.stopPropagation(); show(cur - 1); };
  box.querySelector('.lb-next').onclick = function (e) { e.stopPropagation(); show(cur + 1); };
  box.addEventListener('click', function (e) { if (e.target === box || e.target === big) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
})();
</script>
