const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bgImage = null;
let text = "";
let fontSize = 32;
let lineHeight = 1.4;
let textColor = "#000";

function setCanvasSize(w, h) {
  canvas.width = w;
  canvas.height = h;
  draw();
}

setCanvasSize(1080, 1080);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.font = `${fontSize}px iPhone`;

  const lines = text.split("\n");
  const startY = canvas.height / 3;

  lines.forEach((line, i) => {
    ctx.fillText(
      line,
      canvas.width / 2,
      startY + i * fontSize * lineHeight
    );
  });
}

document.getElementById("textInput").oninput = e => {
  text = e.target.value;
  draw();
};

document.getElementById("fontSize").oninput = e => {
  fontSize = e.target.value;
  draw();
};

document.getElementById("lineHeight").oninput = e => {
  lineHeight = e.target.value;
  draw();
};

document.getElementById("textColor").oninput = e => {
  textColor = e.target.value;
  draw();
};

document.getElementById("sizePreset").onchange = e => {
  const [w, h] = e.target.value.split("x");
  setCanvasSize(+w, +h);
};

document.getElementById("bgUpload").onchange = e => {
  const img = new Image();
  img.onload = () => {
    bgImage = img;
    draw();
  };
  img.src = URL.createObjectURL(e.target.files[0]);
};

document.querySelectorAll(".emoji-bar img").forEach(img => {
  img.onclick = () => {
    text += " ";
    draw();
    ctx.drawImage(img, canvas.width / 2 - 16, canvas.height / 2, 32, 32);
  };
});

document.getElementById("download").onclick = () => {
  const link = document.createElement("a");
  link.download = "image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};document.getElementById("fontSize").oninput = e => {
  if (activeText) activeText.style.fontSize = e.target.value + "px";
};

/* Stroke */
document.getElementById("strokeBtn").onclick = () => {
  if (activeText) activeText.classList.toggle("stroke");
};

/* Gradient */
document.getElementById("gradientBtn").onclick = () => {
  if (activeText) activeText.classList.toggle("gradient");
};

/* Emojis */
document.querySelectorAll(".emoji").forEach(btn => {
  btn.onclick = () => {
    if (activeText) {
      activeText.innerHTML += " " + btn.dataset.emoji;
      twemoji.parse(activeText);
    }
  };
});

/* Drag text */
function drag(el) {
  let isDown = false, ox, oy;

  el.onmousedown = e => {
    isDown = true;
    activeText = el;
    ox = e.offsetX;
    oy = e.offsetY;
  };

  document.onmousemove = e => {
    if (!isDown) return;
    el.style.left = e.pageX - ox + "px";
    el.style.top = e.pageY - oy + "px";
  };

  document.onmouseup = () => isDown = false;
}

/* Export PNG full quality */
document.getElementById("exportBtn").onclick = () => {
  html2canvas(canvas, { scale: 3 }).then(c => {
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "iphone-style-text.png";
    a.click();
  });
};
