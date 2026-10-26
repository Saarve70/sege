function fadeImage(img, newSrc) {
  img.style.opacity = 0;
  setTimeout(function () {
    img.style.display = "block";   
    img.src = newSrc;
    img.style.opacity = 1;
  }, 350);
}
var progress = document.getElementById("progress");

window.addEventListener("scroll", function () {
  var scrolled = window.scrollY;
  var total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (scrolled / total * 100) + "%";
});

function startSlideshow(dots, change) {
  var current = 0;
  var timer;
  function markActive(n) {
    dots.forEach(function (dot) { dot.classList.remove("active"); });
    dots[n].classList.add("active");
  }
  function show(n) {
    current = n;
    markActive(n);
    change(n);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () {
      show((current + 1) % dots.length);
    }, 3000);
  }
  dots.forEach(function (dot, i) {
    dot.onclick = function () {
      show(i);
      restart();
    };
  });

  restart();
}


document.querySelectorAll("img").forEach(function (img) {
  img.onerror = function () { img.style.display = "none"; };
  if (img.complete && img.naturalWidth === 0) { img.style.display = "none"; }
});

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll("section, footer").forEach(function (sec) {
  sec.classList.add("reveal");
  revealObserver.observe(sec);
});

var avatars = document.querySelectorAll(".avatar");

avatars.forEach(function (avatar) {
  avatar.onclick = function () {
    var wasZoomed = avatar.classList.contains("zoom");
    avatars.forEach(function (a) { a.classList.remove("zoom"); });   
    if (!wasZoomed) { avatar.classList.add("zoom"); }                
  };
});

var dashes = document.querySelectorAll(".dashes span");
var dashTimer;

var homePics = document.querySelectorAll(".home-card img");

function showHomePic(n) {
  homePics.forEach(function (p) { p.classList.remove("active"); });
  homePics[n].classList.add("active");
}

function runDash(n) {
  showHomePic(n);
  dashes.forEach(function (d, i) {
    d.classList.remove("run", "done");
    if (i < n) { d.classList.add("done"); }
  });
  void dashes[n].offsetWidth;
  dashes[n].classList.add("run");

  clearTimeout(dashTimer);
  dashTimer = setTimeout(function () {
    runDash((n + 1) % dashes.length);
  }, 4000);
}

dashes.forEach(function (dash, i) {
  dash.onclick = function () { runDash(i); };
});

setTimeout(function () { runDash(0); }, 100);


function fillBar(fill, label, target) {
  fill.token = (fill.token || 0) + 1;   
  var myToken = fill.token;
  var startTime = null;

  function step(now) {
    if (fill.token !== myToken) { return; }          
    if (startTime === null) { startTime = now; }

    var progress = Math.min((now - startTime) / 2000, 1);  
    var value = Math.round(progress * target);

    fill.style.width = value + "%";
    label.textContent = value + "%";

    if (progress < 1) { requestAnimationFrame(step); }
  }
  requestAnimationFrame(step);
}

function resetBar(fill, label) {
  fill.token = (fill.token || 0) + 1;
  fill.style.width = "0%";
  label.textContent = "0%";
}

function watchBars(sectionId, list) {
  var section = document.getElementById(sectionId);

  list.forEach(function (b) {
    resetBar(document.querySelector(b.fill), document.querySelector(b.label));
  });

  var observer = new IntersectionObserver(function (entries) {
    var visible = entries[0].isIntersecting;
    list.forEach(function (b) {
      var fill = document.querySelector(b.fill);
      var label = document.querySelector(b.label);
      if (visible) { fillBar(fill, label, b.target); }
      else { resetBar(fill, label); }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
}
watchBars("home", [
  { fill: ".hb1 i", label: ".hp1", target: 60 },
  { fill: ".hb2 i", label: ".hp2", target: 80 }
]);
watchBars("item", [
  { fill: ".ib1 i", label: ".ip1", target: 75 },
  { fill: ".ib2 i", label: ".ip2", target: 75 }
]);

var modal = document.getElementById("galleryModal");

function openModal() {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";   
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("seeAll").onclick = openModal;
document.getElementById("modalClose").onclick = closeModal;

modal.onclick = function (e) {
  if (e.target === modal) { closeModal(); }
};
document.onkeydown = function (e) {
  if (e.key === "Escape") { closeModal(); }
};

var faqPics = ["images/faq.jpg", "images/faq2.jpg", "images/faq3.jpg"];
var faqImg = document.getElementById("faqImg");
var faqDots = document.querySelectorAll(".dot");

startSlideshow(Array.from(faqDots), function (n) {
  fadeImage(faqImg, faqPics[n]);
});

var barsBox = document.querySelector(".bars");
var barItems = document.querySelectorAll(".bars span");
var barStep = 0;

barsBox.classList.add("ready");  

setInterval(function () {
  if (barStep < barItems.length) {
    barItems[barStep].classList.add("on");      
    barStep++;
  } else if (barStep < barItems.length + 3) {
    barStep++;                               
  } else {
    barItems.forEach(function (b) { b.classList.remove("on"); });  
    barStep = 0;
  }
}, 700);

var itemPics = ["images/item1.jpg", "images/item2.jpg", "images/item3.jpg"];
var itemImgA = document.getElementById("itemImgA");
var itemImgB = document.getElementById("itemImgB");
var pagerDots = document.querySelectorAll(".pager span");

startSlideshow(Array.from(pagerDots), function (n) {
  fadeImage(itemImgA, itemPics[n]);
  fadeImage(itemImgB, itemPics[(n + 1) % itemPics.length]);
});

var sendBtn = document.getElementById("sendBtn");
var emailInput = document.getElementById("emailInput");

sendBtn.onclick = function () {
  if (emailInput.value === "") {
    alert("Please enter your email");
  } else {
    alert("Thank you for subscribing!");
    emailInput.value = "";
  }
};

/* HAMBURGER MENU */
var nav = document.getElementById("nav");
var menuToggle = document.getElementById("menuToggle");

menuToggle.onclick = function () {
  nav.classList.toggle("open");
};

document.querySelectorAll(".menu a").forEach(function (link) {
  link.onclick = function () { nav.classList.remove("open"); };
});

/* ACTIVE MENU (scroll korle menu er rong ar underline change hobe) */
var menuLinks = document.querySelectorAll(".menu a");

function updateActiveLink() {
  var current = "#home";   // shuru te Home active thakbe

  // jei section er upor diye scroll hoye gese, shetai current hobe
  menuLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    var section = document.querySelector(id);
    if (section.getBoundingClientRect().top <= 150) {
      current = id;
    }
  });

  // page er ekdom niche gele Contact active hobe
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 5) {
    current = "#footer";
  }

  menuLinks.forEach(function (link) {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();   // page load hole ekbar chalabe


/* NUMBER COUNT UP (section e ashle 0 theke number gulo gunte gunte bARbe) */
var numberItems = [];

// jei jei jaygay number ache shegulo (HTML e kichu change korte hoy ni)
document.querySelectorAll(".stat b, .ab-white b, .fq-price, .it-n, .id-5, .id-14").forEach(function (el) {
  el.childNodes.forEach(function (child) {
    // shudhu oi text ta nibo jar bhetore number ache (jmn "15.0K+")
    if (child.nodeType === 3 && /\d/.test(child.textContent)) {
      var match = child.textContent.match(/^(\D*)([\d.]+)([\s\S]*)$/);
      // match[1] = number er age ja ache, match[2] = number, match[3] = number er pore ja ache (K+)
      numberItems.push({
        node: child,
        before: match[1],
        target: parseFloat(match[2]),
        decimals: (match[2].split(".")[1] || "").length,
        after: match[3],
        section: el.closest("section"),
        token: 0
      });
    }
  });
});

function showNumber(item, value) {
  item.node.textContent = item.before + value.toFixed(item.decimals) + item.after;
}

function countUp(item) {
  item.token = item.token + 1;
  var myToken = item.token;
  var startTime = null;

  function step(now) {
    if (item.token !== myToken) { return; }
    if (startTime === null) { startTime = now; }

    var progress = Math.min((now - startTime) / 2000, 1);
    showNumber(item, progress * item.target);

    if (progress < 1) { requestAnimationFrame(step); }
  }
  requestAnimationFrame(step);
}

function resetNumber(item) {
  item.token = item.token + 1;
  showNumber(item, 0);
}

// shuru te shob 0 kore rakhbo
numberItems.forEach(function (item) { resetNumber(item); });

var numberObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    numberItems.forEach(function (item) {
      if (item.section !== entry.target) { return; }
      if (entry.isIntersecting) { countUp(item); }
      else { resetNumber(item); }
    });
  });
}, { threshold: 0.2 });

numberItems.forEach(function (item) { numberObserver.observe(item.section); });


/* BACK TO TOP BUTTON (niche scroll korle ashe, click korle upore niye jay) */
var toTop = document.getElementById("toTop");

window.addEventListener("scroll", function () {
  if (window.scrollY > 400) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
});

toTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
toTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


/* ছোট ল্যাপটপ স্ক্রিনে পুরো ডিজাইন স্ক্রিনের মাপে ছোট করবে */
function fitScreen() {
  if (window.innerWidth > 900) {
    document.body.style.zoom = Math.min(window.innerWidth / 1920, 1);
  } else {
    document.body.style.zoom = 1;
  }
}

fitScreen();
window.addEventListener("resize", fitScreen);