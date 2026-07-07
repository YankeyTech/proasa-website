// Close mobile nav when a link is clicked
document.querySelectorAll('.site-nav a').forEach(function (link) {
  link.addEventListener('click', function () {
    var toggle = document.getElementById('nav-toggle');
    if (toggle) toggle.checked = false;
  });
});

// Auto-dismiss flash messages after a few seconds
document.querySelectorAll('.flash').forEach(function (el) {
  setTimeout(function () {
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = '0';
    setTimeout(function () { el.remove(); }, 400);
  }, 5000);
});

// Gallery lightbox
(function () {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var content = document.getElementById('lightbox-content');
  var caption = document.getElementById('lightbox-caption');
  var closeBtn = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-type');
      var src = btn.getAttribute('data-src');
      var cap = btn.getAttribute('data-caption');

      content.innerHTML = '';
      if (type === 'video') {
        var video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        content.appendChild(video);
      } else {
        var img = document.createElement('img');
        img.src = src;
        img.alt = cap || '';
        content.appendChild(img);
      }
      caption.textContent = cap || '';
      lightbox.hidden = false;
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    content.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();
