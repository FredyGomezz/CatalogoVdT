document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // USUARIOS SIMULADOS 🃏fgomez
  // ======================
  const usuarios = [
 { user: "admin",  pass: "777"  },
 { user: "userVendor504",  pass: "3731"  },
 { user: "userVendor704",  pass: "7583"  },
 { user: "userVendor311",  pass: "7997"  },
 { user: "userVendor620",  pass: "3477"  },
 { user: "userVendor532",  pass: "1511"  },
 { user: "userVendor857",  pass: "3882"  },
 { user: "userVendor923",  pass: "3487"  },
 { user: "userVendor150",  pass: "5215"  },
 { user: "userVendor482",  pass: "5953"  },
 { user: "userVendor742",  pass: "1254"  },
 { user: "userVendor215",  pass: "3273"  },
 { user: "userVendor856",  pass: "7780"  },
 { user: "userVendor512",  pass: "5667"  },
 { user: "userVendor446",  pass: "1433"  },
 { user: "userVendor723",  pass: "2040"  },
 { user: "userVendor741",  pass: "6304"  },
 { user: "userVendor660",  pass: "2666"  },
 { user: "userVendor390",  pass: "2692"  },
 { user: "userVendor364",  pass: "8085"  },
 { user: "userVendor605",  pass: "5023"  },
 { user: "userVendor363",  pass: "2172"  },
 { user: "userVendor260",  pass: "9898"  },
 { user: "userVendor193",  pass: "3916"  },
 { user: "userVendor869",  pass: "5700"  },
 { user: "userVendor243",  pass: "3719"  },
 { user: "userVendor171",  pass: "5997"  },
 { user: "userVendor422",  pass: "1581"  },
 { user: "userVendor221",  pass: "8186"  },
 { user: "userVendor138",  pass: "8189"  },
 { user: "userVendor383",  pass: "7284"  },
 { user: "userVendor532",  pass: "8412"  },
 { user: "userVendor221",  pass: "1439"  },
 { user: "userVendor751",  pass: "3258"  },
 { user: "userVendor977",  pass: "2139"  },
 { user: "userVendor211",  pass: "4113"  },
 { user: "userVendor573",  pass: "6705"  },
 { user: "userVendor167",  pass: "6790"  },
 { user: "userVendor549",  pass: "4771"  },
 { user: "userVendor761",  pass: "9992"  },
 { user: "userVendor126",  pass: "7786"  },
 { user: "userVendor650",  pass: "4287"  },
 { user: "userVendor430",  pass: "9273"  }
  ];

  // ======================
  // LOGIN
  // ======================
let usuarioActivo = "";

window.login = function () {
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  const valido = usuarios.find(x => x.user === u && x.pass === p);

  if (!valido) {
    alert("Usuario o contraseña incorrectos");
    return;
  }

  usuarioActivo = u;

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
};

  // ======================
  // CARGA EXCEL
  // ======================
  const fileInput = document.getElementById("fileInput");

  fileInput.addEventListener("change", handleFile);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets["lpvdt"];

      if (!sheet) {
        alert("No existe la hoja 'lpvdt'");
        return;
      }

      const rows = XLSX.utils.sheet_to_json(sheet);

      renderCatalogo(rows);
    };

    reader.readAsArrayBuffer(file);
  }

  // ======================
  // CATÁLOGO
  // ======================
  function renderCatalogo(data) {
    const cont = document.getElementById("catalogo");
    cont.innerHTML = "";

    data.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "producto";

      card.innerHTML = `
      <img src="${p['URL Imagen']}"
        onclick="zoom('${p['URL Imagen']}')"
        onerror="this.src='https://via.placeholder.com/300'">  
        <h4>${p['Nombre']}</h4>
        <p>${p['Descripción']}</p>
        <p><b>$${p['Precio Mayorista (COP)']}</b></p>

        <div class="cantidad-label">Cantidad: <span id="cant-${i}">0</span></div>

        <button onclick="add(${i})">➕ Agregar</button>
        <button onclick="remove(${i})">➖ Quitar</button>
      `;

      cont.appendChild(card);
    });

    window.productos = data;
    window.carrito = {};
  }

  // ======================
  // CARRITO
  // ======================
  window.add = function (i) {
    carrito[i] = (carrito[i] || 0) + 1;
    document.getElementById(`cant-${i}`).innerText = carrito[i];
    renderCarrito();
  };

  window.remove = function (i) {
    if (!carrito[i]) return;
    carrito[i]--;
    document.getElementById(`cant-${i}`).innerText = carrito[i];
    if (carrito[i] === 0) delete carrito[i];
    renderCarrito();
  };

  function renderCarrito() {
    const tbody = document.getElementById("carritoTabla");
    tbody.innerHTML = "";

    let total = 0;

    Object.keys(carrito).forEach(i => {
      const p = productos[i];
      const cant = carrito[i];
      const precio = Number(p["Precio Mayorista (COP)"]);
      const sub = cant * precio;
      total += sub;

      tbody.innerHTML += `
        <tr>
          <td>${cant}</td>
          <td>${p.Nombre}</td>
          <td>$${precio.toLocaleString()}</td>
          <td>$${sub.toLocaleString()}</td>
        </tr>
      `;
    });

    tbody.innerHTML += `
      <tr>
        <td colspan="3"><b>Total</b></td>
        <td><b>$${total.toLocaleString()}</b></td>
      </tr>
    `;
  }

  // ======================
  // WHATSAPP
  // ======================
window.enviarWhatsApp = function () {

  if (!Object.keys(carrito).length) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = `PEDIDO - Ventas de Temporada\n`;
  mensaje += `Código usuario: ${usuarioActivo}\n`;
  mensaje += `Fecha y hora: ${new Date().toLocaleString()}\n\n`;
  mensaje += `Detalle del pedido:\n`;

  let total = 0;
  let i = 1;

  Object.keys(carrito).forEach(idx => {
    const p = productos[idx];
    const cant = carrito[idx];
    const precio = Number(p["Precio Mayorista (COP)"]);
    const subtotal = precio * cant;

    total += subtotal;

    mensaje += `${i}️▪ ${p.Nombre}\n`;
    mensaje += `   Cantidad: ${cant}\n`;
    mensaje += `   Precio: $${precio.toLocaleString()}\n`;
    mensaje += `   Subtotal: $${subtotal.toLocaleString()}\n\n`;

    i++;
  });

  mensaje += `------------------------\n`;
  mensaje += `- TOTAL: $${total.toLocaleString()}`;

  const url = `https://wa.me/573203284420?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
};

window.exportPDF = function () {

  if (!Object.keys(carrito).length) {
    alert("El carrito está vacío");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 15;
  doc.setFontSize(14);
  doc.text("PEDIDO - Ventas de Temporada", 10, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Usuario: ${usuarioActivo}`, 10, y);
  y += 10;
  
  doc.setFontSize(11);
  doc.text(`Fecha y hora: ${new Date().toLocaleString()}`, 10, y);
  y += 10;
  
  let total = 0;

  Object.keys(carrito).forEach((i, index) => {
    const p = productos[i];
    const cant = carrito[i];
    const precio = Number(p["Precio Consumidor (COP)"]);
    const sub = cant * precio;

    doc.text(`${index + 1}. ${p.Nombre}`, 10, y);
    y += 6;
    doc.text(`   Cantidad: ${cant}`, 10, y);
    y += 6;
    doc.text(`   Precio: $${precio.toLocaleString()}`, 10, y);
    y += 6;
    doc.text(`   Subtotal: $${sub.toLocaleString()}`, 10, y);
    y += 8;

    total += sub;
  });

  doc.text(`TOTAL: $${total.toLocaleString()}`, 10, y + 5);
  doc.save("Pedido_Ventas_de_Temporada.pdf");
};


// ==========================
// ZOOM DE IMAGEN
// ==========================
window.zoom = function (src) {
  const modal = document.getElementById("zoomModal");
  const img = document.getElementById("zoomImg");

  img.src = src;
  modal.style.display = "flex";
};

window.cerrarZoom = function () {
  document.getElementById("zoomModal").style.display = "none";
};

const CACHE_NAME = "catalogo-v1";
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./logo.png",
  "./manifest.json",
  "./libs/xlsx.full.min.js",
  "./libs/jspdf.umd.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});


});
