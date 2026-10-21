// Click any gallery photo to view it full screen. Arrow keys / Esc work too.
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
  if (!imgs.length) return;
  var box = document.createElement('div');
  box.id = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button>' +
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
  function open(i) { show(i); box.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { box.classList.remove('open'); document.body.style.overflow = ''; }

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
