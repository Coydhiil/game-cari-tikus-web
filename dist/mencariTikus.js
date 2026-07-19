let posisiTikus = 0;
let jumlahTebakan = 0;
let gameSelesai = false;

function initGame() {
  posisiTikus = Math.floor(Math.random() * 9) + 1;
  jumlahTebakan = 0;
  gameSelesai = false;

  document.getElementById("attempt-badge").innerText = "0 / 8 Percobaan";
  updateStars();
  updateIcon(0);

  const resultDiv = document.getElementById("result");
  resultDiv.className =
    "bg-emerald-800 rounded-2xl p-4 min-h-[84px] flex flex-col items-center justify-center text-center text-sm text-white border border-emerald-900/20 leading-relaxed font-medium";
  resultDiv.innerText = "Pilih salah satu lubang di atas untuk mulai mencari!";

  document.getElementById("resetBtn").style.display = "none";
  setupButtons();
}

function setupButtons() {
  const container = document.getElementById("buttons");
  container.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
    let btn = document.createElement("button");
    btn.className =
      "hole-btn w-16 h-16 bg-amber-100 border border-amber-300 hover:bg-amber-200 hover:border-amber-400 transition-all duration-200 flex items-center justify-center cursor-pointer relative focus:outline-none";
    btn.innerHTML = `<span class="text-amber-800 select-none text-lg font-bold">${i}</span>`;
    btn.id = `btn-${i}`;
    btn.onclick = () => kirimTebakan(i);
    container.appendChild(btn);
  }
}

function updateStars() {
  const starsContainer = document.getElementById("stars-container");
  if (jumlahTebakan === 0) {
    starsContainer.innerHTML = `
      <span class="text-amber-400">★</span>
      <span class="text-amber-400">★</span>
      <span class="text-amber-400">★</span>
    `;
    return;
  }

  let stars = "";
  if (jumlahTebakan <= 3) {
    stars =
      '<span class="text-amber-400">★</span><span class="text-amber-400">★</span><span class="text-amber-400">★</span>';
  } else if (jumlahTebakan <= 5) {
    stars =
      '<span class="text-amber-400">★</span><span class="text-amber-400">★</span><span class="text-slate-600">☆</span>';
  } else if (jumlahTebakan <= 7) {
    stars =
      '<span class="text-amber-400">★</span><span class="text-slate-600">☆</span><span class="text-slate-600">☆</span>';
  } else {
    stars =
      '<span class="text-slate-600">☆</span><span class="text-slate-600">☆</span><span class="text-slate-600">☆</span>';
  }
  starsContainer.innerHTML = stars;
}

function kirimTebakan(tebak) {
  if (gameSelesai) return;

  jumlahTebakan++;

  document.getElementById("attempt-badge").innerText =
    `${jumlahTebakan} / 8 Percobaan`;
  updateStars();

  const resultDiv = document.getElementById("result");
  const btn = document.getElementById(`btn-${tebak}`);

  if (tebak === posisiTikus) {
    gameSelesai = true;

    revealCippy(btn, true);
    btn.classList.add("bg-amber-500", "text-white", "animate-pulse-green");
    btn.classList.remove("bg-amber-100", "hover:bg-amber-200");
    updateIcon(tebak);

    let headingHtml = `<span class="text-emerald-400 font-bold text-lg block mb-1">Hore! Kamu Menemukan Cippy!</span>`;
    let detailHtml = "";

    if (jumlahTebakan <= 3) {
      detailHtml = `<span class="text-emerald-300 font-semibold">Anjay! Kamu hanya butuh ${jumlahTebakan} tebakan!</span>`;
    } else if (jumlahTebakan <= 5) {
      detailHtml = `<span class="text-amber-300 font-medium">Bagus sekali! Kamu menemukannya dalam ${jumlahTebakan} tebakan.</span>`;
    } else {
      detailHtml = `<span class="text-slate-300">Berhasil! Kamu menemukannya dalam ${jumlahTebakan} tebakan.</span>`;
    }

    resultDiv.className =
      "bg-emerald-900 rounded-2xl p-4 min-h-[84px] flex flex-col items-center justify-center text-center text-sm border border-emerald-700 leading-relaxed";
    resultDiv.innerHTML = `${headingHtml}${detailHtml}`;

    endGame();
    return;
  }

  btn.innerHTML = `<span class="text-rose-500/50 text-xl font-bold font-sans">✕</span>`;
  btn.classList.add("wrong-hole", "animate-shake");
  btn.disabled = true;

  if (jumlahTebakan === 8) {
    gameSelesai = true;
    resultDiv.className =
      "bg-rose-900 rounded-2xl p-4 min-h-[84px] flex flex-col items-center justify-center text-center text-sm border border-rose-800 leading-relaxed";
    resultDiv.innerHTML = `
      <span class="text-rose-300 font-bold text-lg block mb-1">Cippy Kabur...</span>
      <span class="text-rose-100">Game Over! Kesempatan habis. Cippy berada di Lubang ${posisiTikus}.</span>
    `;

    const correctBtn = document.getElementById(`btn-${posisiTikus}`);
    if (correctBtn) {
      revealCippy(correctBtn, false);
      correctBtn.classList.add("bg-amber-500", "text-white");
      correctBtn.classList.remove("bg-amber-100", "hover:bg-amber-200");
    }

    endGame();
    return;
  }

  let direction = tebak < posisiTikus ? "kanan ->" : "kiri <-";
  resultDiv.className =
    "bg-emerald-800 rounded-2xl p-4 min-h-[84px] flex flex-col items-center justify-center text-center text-sm border border-emerald-900/20 text-white leading-relaxed font-semibold";
  resultDiv.innerHTML = `
    <span>Tebakan salah!</span>
    <span class="text-xs text-emerald-200 mt-1">Cippy berada di sebelah <span class="text-amber-300 font-bold underline">${direction}</span> dari Lubang ${tebak}</span>
  `;
}

function revealCippy(btn, isFound) {
  btn.innerHTML = isFound
    ? `<img src="src/cippy_was_found.png" class="w-4 h-4">`
    : `<img src="src/cippy.png" class="w-4 h-4">`;
}

function updateIcon(tebak) {
  const imgElement = document.getElementById("cippy-image");
  if (!imgElement) return;

  imgElement.src =
    tebak === posisiTikus ? "src/cippy_was_found.png" : "src/cippy.png";
}

function endGame() {
  for (let i = 1; i <= 9; i++) {
    let btn = document.getElementById(`btn-${i}`);
    if (btn) btn.disabled = true;
  }
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.style.display = "inline-block";
}

window.onload = initGame;
