const isAdmin = localStorage.getItem("adminLogin") === "true";

if (location.pathname.includes("admin.html") && !isAdmin) {
  location.href = "login.html";
}

function simpanProduk() {
  if (
    typeof gambarBase64 === "undefined" ||
    !nama.value ||
    !harga.value ||
    !gambarBase64
  ) {
    alert("Lengkapi semua data");
    return;
  }

  let produk = JSON.parse(localStorage.getItem("produk") || "[]");

  produk.push({
    id: Date.now(),
    nama: nama.value,
    harga: harga.value,
    gambar: gambarBase64,
    fitur: fitur.value
      .split("\n")
      .map(f => f.trim())
      .filter(Boolean),
    order: produk.length
  });

  localStorage.setItem("produk", JSON.stringify(produk));

  if (typeof resetPreview === "function") resetPreview();
  nama.value = "";
  harga.value = "";
  fitur.value = "";
  gambarBase64 = "";

  alert("Produk berhasil disimpan");
  renderAdminList();
  renderIndex();
}

function moveProduk(id, arah) {
  let produk = JSON.parse(localStorage.getItem("produk") || "[]");
  produk.sort((a, b) => a.order - b.order);

  const index = produk.findIndex(p => p.id === id);
  if (index === -1) return;

  const target = index + arah;
  if (target < 0 || target >= produk.length) return;

  [produk[index].order, produk[target].order] = [
    produk[target].order,
    produk[index].order
  ];

  localStorage.setItem("produk", JSON.stringify(produk));
  renderAdminList();
  renderIndex();
}

function hapusProduk(id) {
  if (!confirm("Hapus produk ini?")) return;

  let produk = JSON.parse(localStorage.getItem("produk") || "[]");
  produk = produk.filter(p => p.id !== id);

  produk.forEach((p, i) => (p.order = i));

  localStorage.setItem("produk", JSON.stringify(produk));
  renderAdminList();
  renderIndex();
}

function renderAdminList() {
  const list = document.getElementById("list");
  if (!list || !isAdmin) return;

  let produk = JSON.parse(localStorage.getItem("produk") || "[]");
  produk.sort((a, b) => a.order - b.order);

  if (!produk.length) {
    list.innerHTML = "<p>Belum ada produk.</p>";
    return;
  }

  list.innerHTML = produk
    .map(
      p => `
    <div class="item">
      <div>
        <b>${p.nama}</b><br>
        <small>Rp ${p.harga}</small>
      </div>
      <div>
        <button onclick="moveProduk(${p.id}, -1)">⬆</button>
        <button onclick="moveProduk(${p.id}, 1)">⬇</button>
        <button onclick="hapusProduk(${p.id})">🗑</button>
      </div>
    </div>
  `
    )
    .join("");
}

function renderIndex() {
  const container = document.getElementById("produk");
  if (!container) return;

  let produk = JSON.parse(localStorage.getItem("produk") || "[]");
  produk.sort((a, b) => a.order - b.order);

  if (!produk.length) {
    container.innerHTML =
      "<p style='text-align:center'>Belum ada produk.</p>";
    return;
  }

  container.innerHTML = produk
    .map(
      p => `
    <div class="product">
      <div class="img-wrap">
        <img src="${p.gambar}" class="product-img">
      </div>

      <h2>${p.nama}</h2>
      <div class="price">Rp ${p.harga}</div>

      <div class="buttons">
        <button class="btn btn-buy"
          onclick="window.open('https://discord.gg/linkdiscord','_blank')">
          Buy Script
        </button>
        <button class="btn btn-feature" onclick="toggleFeature(this)">
          Cek Fitur
        </button>
      </div>

      <div class="features">
        <ul>
          ${p.fitur.map(f => `<li>${f}</li>`).join("")}
        </ul>
      </div>
    </div>
  `
    )
    .join("");
}

function toggleFeature(btn) {
  const features = btn.parentElement.nextElementSibling;
  if (!features) return;

  features.style.display =
    features.style.display === "block" ? "none" : "block";
}

renderAdminList();
renderIndex();