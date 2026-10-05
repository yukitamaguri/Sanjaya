
const schoolData = {
  activities: [
    {date:"17 Nov 2025", category:"Sekolah", title:"Peringatan Hari Pahlawan Nasional", description:"Placeholder deskripsi kegiatan sekolah.", image:"hari-pahlawan"},
    {date:"2025", category:"Teknologi", title:"Digital Studentpreneur", description:"Kegiatan pembelajaran dan pengembangan keterampilan digital siswa.", image:"studentpreneur"},
    {date:"2025", category:"Ekstrakurikuler", title:"Kegiatan Robotik", description:"Placeholder deskripsi kegiatan robotik sekolah.", image:"kegiatan-robotik"},
    {date:"2025", category:"Lingkungan", title:"P5 Urban Farming", description:"Placeholder deskripsi proyek penguatan profil pelajar.", image:"urban-farming"}
  ],
  achievements: [
    {category:"Inovasi", title:"Top 10 Kompetisi Inovasi Sidoarjo 2025", description:"Guru SMPN 1 Porong masuk Top 10 KISI dari 216 peserta.", image:"inovasi"},
    {category:"O2SN", title:"Juara 3 Karate Putra Tingkat Provinsi Jawa Timur", description:"Prestasi olahraga tingkat provinsi.", image:"karate"},
    {category:"Olahraga", title:"Juara 2 Kyoguri Cadet Putri", description:"Juara 2 dalam ajang KAPOLRI Cup 6.", image:"kyoguri"}
  ],
  extracurriculars: [
    {name:"Robotik", type:"Teknologi", image:"robotik"},
    {name:"Pramuka", type:"Kepemimpinan", image:"pramuka"},
    {name:"Seni", type:"Kreativitas", image:"seni"},
    {name:"Olahraga", type:"Kebugaran", image:"olahraga"}
  ],
  gallery: [
    {title:"Kegiatan Siswa", category:"Kegiatan", image:"kegiatan-siswa"},
    {title:"Robotik", category:"Ekstrakurikuler", image:"robotik"},
    {title:"Perpustakaan", category:"Fasilitas", image:"perpustakaan"},
    {title:"Lapangan", category:"Fasilitas", image:"lapangan"},
    {title:"Pramuka", category:"Ekstrakurikuler", image:"pramuka"},
    {title:"Prestasi", category:"Prestasi", image:"prestasi"}
  ]
};


const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "svg"];

function imageCandidates(name, folder = "") {
  const clean = String(name || "").trim().toLowerCase();
  const paths = [];
  for (const ext of IMAGE_EXTENSIONS) {
    paths.push(`assets/images/${clean}.${ext}`);
  }
  if (folder) {
    for (const ext of IMAGE_EXTENSIONS) {
      paths.push(`assets/images/${folder}/${clean}.${ext}`);
    }
  }
  return [...new Set(paths)];
}

function loadManagedImage(img) {
  const name = img.dataset.imageName;
  if (!name) return;
  const folder = img.dataset.imageFolder || "";
  const placeholder = img.getAttribute("src");
  const candidates = imageCandidates(name, folder);
  let index = 0;

  const tryNext = () => {
    if (index >= candidates.length) {
      if (placeholder) img.src = placeholder;
      return;
    }
    const next = candidates[index++];
    if (img.getAttribute("src") === next) return tryNext();
    img.onerror = tryNext;
    img.src = next;
  };
  tryNext();
}

function loadManagedBackground(el) {
  const name = el.dataset.imageBgName;
  if (!name) return;
  const folder = el.dataset.imageBgFolder || "";
  const placeholder = el.dataset.imagePlaceholder || "";
  const candidates = imageCandidates(name, folder);
  let index = 0;

  const tryNext = () => {
    if (index >= candidates.length) {
      if (placeholder) el.style.backgroundImage = `url("${placeholder}")`;
      return;
    }
    const url = candidates[index++];
    const probe = new Image();
    probe.onload = () => {
      el.style.backgroundImage = `url("${url}")`;
    };
    probe.onerror = tryNext;
    probe.src = url;
  };
  tryNext();
}

function initImageManager() {
  document.querySelectorAll("img[data-image-name]").forEach(loadManagedImage);
  document.querySelectorAll("[data-image-bg-name]").forEach(loadManagedBackground);

  document.querySelectorAll("[data-lightbox][data-image-name]").forEach(item => {
    const name = item.dataset.imageName;
    const folder = item.dataset.imageFolder || "";
    const candidates = imageCandidates(name, folder);
    let index = 0;
    const probe = new Image();
    const next = () => {
      if (index >= candidates.length) return;
      const url = candidates[index++];
      probe.onload = () => item.dataset.lightbox = url;
      probe.onerror = next;
      probe.src = url;
    };
    next();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const backTop = document.querySelector(".back-top");

  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 24);
    backTop?.classList.toggle("show", window.scrollY > 700);
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    doc.style.setProperty("--scroll-progress", max > 0 ? `${window.scrollY / max}` : "0");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});

  toggle?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });
  mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.remove("open"); toggle?.classList.remove("active");
    document.body.classList.remove("menu-open");
  }));
  backTop?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:"smooth",block:"start"}); }
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }});
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  document.querySelectorAll("[data-count]").forEach(el => {
    const target = Number(el.dataset.count);
    const observer = new IntersectionObserver(entries => {
      if(!entries[0].isIntersecting) return;
      let start = 0, duration = 1200, startTime = null;
      const tick = t => {
        if(!startTime) startTime=t;
        const p=Math.min((t-startTime)/duration,1);
        const eased=1-Math.pow(1-p,3);
        el.textContent = Math.floor(target*eased).toLocaleString("id-ID");
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); observer.disconnect();
    }, {threshold:.5});
    observer.observe(el);
  });

  initImageManager();
  initGallery();
  initFilters();
  setActiveNav();
});

function setActiveNav(){
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    if(a.getAttribute("href") === current) a.classList.add("active");
  });
  document.querySelectorAll('.nav-links a[href="index.html"]').forEach(a => { a.dataset.section = "beranda"; });
  document.querySelectorAll('.nav-links a[href="tentang.html"]').forEach(a => { a.dataset.section = "tentang"; });
  document.querySelectorAll('.nav-links a[href="kegiatan.html"]').forEach(a => { a.dataset.section = "kegiatan"; });
  document.querySelectorAll('.nav-links a[href="prestasi.html"]').forEach(a => { a.dataset.section = "prestasi"; });
  document.querySelectorAll('.nav-links a[href="ekstrakurikuler.html"]').forEach(a => { a.dataset.section = "ekstrakurikuler"; });
  document.querySelectorAll('.nav-links a[href="galeri.html"]').forEach(a => { a.dataset.section = "galeri"; });
  document.querySelectorAll('.nav-links a[href="informasi.html"]').forEach(a => { a.dataset.section = "informasi"; });
  initScrollSpy();
}

function initScrollSpy(){
  if(location.pathname.split("/").pop() !== "index.html" && location.pathname.split("/").pop() !== "") return;
  const sections = [...document.querySelectorAll("main > section[id]")];
  const links = [...document.querySelectorAll('.nav-links a[href="index.html"]')];
  if(!sections.length || !links.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => a.classList.toggle("active", a.dataset.section === id));
    });
  }, {rootMargin:"-35% 0px -55% 0px", threshold:0});
  sections.forEach(section => observer.observe(section));
}

function initGallery(){
  const items = [...document.querySelectorAll("[data-lightbox]")];
  const box = document.querySelector(".lightbox");
  if(!box || !items.length) return;
  const image = box.querySelector("img"), caption = box.querySelector(".lightbox-caption");
  let index=0;
  const show = i => {
    index=(i+items.length)%items.length;
    image.src=items[index].dataset.lightbox;
    image.alt=items[index].dataset.caption || "";
    caption.textContent=items[index].dataset.caption || "";
    box.classList.add("open"); document.body.classList.add("menu-open");
  };
  const close=()=>{box.classList.remove("open");document.body.classList.remove("menu-open")};
  items.forEach((item,i)=>item.addEventListener("click",()=>show(i)));
  box.querySelector(".lightbox-close")?.addEventListener("click",close);
  box.querySelector(".lightbox-prev")?.addEventListener("click",()=>show(index-1));
  box.querySelector(".lightbox-next")?.addEventListener("click",()=>show(index+1));
  box.addEventListener("click",e=>{if(e.target===box)close()});
  document.addEventListener("keydown",e=>{
    if(!box.classList.contains("open"))return;
    if(e.key==="Escape")close(); if(e.key==="ArrowLeft")show(index-1); if(e.key==="ArrowRight")show(index+1);
  });
  let x=0;
  box.addEventListener("touchstart",e=>x=e.changedTouches[0].clientX,{passive:true});
  box.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>50)show(index+(dx<0?1:-1))},{passive:true});
}

function initFilters(){
  document.querySelectorAll("[data-filter-group]").forEach(group=>{
    const buttons=group.querySelectorAll("[data-filter]");
    const cards=group.querySelectorAll("[data-category-item]");
    buttons.forEach(btn=>btn.addEventListener("click",()=>{
      buttons.forEach(b=>b.classList.remove("active")); btn.classList.add("active");
      const filter=btn.dataset.filter;
      cards.forEach(card=>{card.hidden=filter!=="all" && card.dataset.categoryItem!==filter});
    }));
  });
}
