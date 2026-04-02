document.addEventListener("DOMContentLoaded", function () {
  var MIN_SCALE = 0.2;
  var MAX_SCALE = 5;
  var WHEEL_STEP = 0.1;
  var BTN_STEP = 0.25;

  function setup() {
    document.querySelectorAll(".mermaid").forEach(function (el) {
      if (el.dataset.zoomBound) return;
      el.dataset.zoomBound = "true";
      el.classList.add("mermaid-zoom-hint");
      el.addEventListener("click", function () {
        openOverlay(el);
      });
    });
  }

  function icon(pathD) {
    return '<svg viewBox="0 0 24 24"><path d="' + pathD + '"/></svg>';
  }

  function openOverlay(source) {
    var scale = 1;
    var panX = 0;
    var panY = 0;
    var isPanning = false;
    var startX = 0;
    var startY = 0;
    var startPanX = 0;
    var startPanY = 0;

    var overlay = document.createElement("div");
    overlay.className = "mermaid-overlay";

    var viewport = document.createElement("div");
    viewport.className = "mermaid-overlay-viewport";

    var toolbar = document.createElement("div");
    toolbar.className = "mermaid-overlay-toolbar";

    var zoomIn = document.createElement("button");
    zoomIn.title = "Zoom in";
    zoomIn.innerHTML = icon("M12 5v14M5 12h14");

    var zoomOut = document.createElement("button");
    zoomOut.title = "Zoom out";
    zoomOut.innerHTML = icon("M5 12h14");

    var resetBtn = document.createElement("button");
    resetBtn.title = "Reset zoom";
    resetBtn.innerHTML = icon(
      "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"
    );

    var closeBtn = document.createElement("button");
    closeBtn.title = "Close";
    closeBtn.innerHTML = icon("M18 6L6 18M6 6l12 12");

    toolbar.append(zoomIn, zoomOut, resetBtn, closeBtn);

    var canvas = document.createElement("div");
    canvas.className = "mermaid-overlay-canvas";

    var inner = document.createElement("div");
    inner.className = "mermaid-overlay-inner";
    inner.innerHTML = source.innerHTML;

    canvas.appendChild(inner);
    viewport.append(toolbar, canvas);
    overlay.appendChild(viewport);
    document.body.appendChild(overlay);
    document.body.classList.add("mermaid-overlay-open");
    document.documentElement.classList.add("mermaid-overlay-open");

    requestAnimationFrame(function () {
      overlay.classList.add("active");
    });

    function applyTransform() {
      scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
      inner.style.transform =
        "translate(-50%, -50%) " +
        "translate(" + panX + "px, " + panY + "px) " +
        "scale(" + scale + ")";
    }

    function resetView() {
      scale = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    }

    applyTransform();

    zoomIn.addEventListener("click", function (e) {
      e.stopPropagation();
      scale += BTN_STEP;
      applyTransform();
    });

    zoomOut.addEventListener("click", function (e) {
      e.stopPropagation();
      scale -= BTN_STEP;
      applyTransform();
    });

    resetBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      resetView();
    });

    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeOverlay();
    });

    // Mouse wheel zoom
    canvas.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        var delta = e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP;
        scale += delta;
        applyTransform();
      },
      { passive: false }
    );

    // Mouse drag to pan
    canvas.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      startPanX = panX;
      startPanY = panY;
      canvas.classList.add("grabbing");
      e.preventDefault();
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
      if (!isPanning) return;
      panX = startPanX + (e.clientX - startX);
      panY = startPanY + (e.clientY - startY);
      applyTransform();
    }

    function onMouseUp() {
      isPanning = false;
      canvas.classList.remove("grabbing");
    }

    // Touch: pinch-to-zoom + drag to pan
    var lastTouchDist = 0;
    var lastTouchX = 0;
    var lastTouchY = 0;

    canvas.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          lastTouchDist = getTouchDist(e.touches);
        } else if (e.touches.length === 1) {
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
          startPanX = panX;
          startPanY = panY;
        }
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          var dist = getTouchDist(e.touches);
          var delta = (dist - lastTouchDist) * 0.01;
          scale += delta;
          applyTransform();
          lastTouchDist = dist;
        } else if (e.touches.length === 1) {
          panX = startPanX + (e.touches[0].clientX - lastTouchX);
          panY = startPanY + (e.touches[0].clientY - lastTouchY);
          applyTransform();
        }
      },
      { passive: false }
    );

    function getTouchDist(touches) {
      var dx = touches[0].clientX - touches[1].clientX;
      var dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Close on backdrop click
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeOverlay();
    });

    // Close on Escape
    function onKey(e) {
      if (e.key === "Escape") closeOverlay();
    }
    document.addEventListener("keydown", onKey);

    function closeOverlay() {
      overlay.classList.remove("active");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("mermaid-overlay-open");
      document.documentElement.classList.remove("mermaid-overlay-open");
      setTimeout(function () {
        overlay.remove();
      }, 150);
    }
  }

  setup();
  new MutationObserver(setup).observe(document.body, {
    childList: true,
    subtree: true,
  });
});
