const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const video = document.getElementById("video");

let img = null;
let isVideo = false;

let text = "";
let x = 540, y = 540;
let size = 50;
let color = "#000";
let font = "SF";
let anim = "none";
let alpha = 1;
let scale = 1;

canvas.width = 1080;
canvas.height = 1080;

/* Upload image or video */
media.onchange = e => {
  const f = e.target.files[0];
  if (!f) return;

  if (f.type.startsWith("video")) {
    isVideo = true;
    video.src = URL.createObjectURL(f);
    video.play();
    drawVideo();
  } else {
    isVideo = false;
    img = new Image();
    img.src = URL.createObjectURL(f);
    img.onload = draw;
  }
};

/* Canvas size */
sizePreset.onchange = e => {
  if (e.target.value === "tt") {
    canvas.width = 1080;
    canvas.height = 1920;
  } else {
    canvas.width = 1080;
    canvas.height = 1080;
  }
  draw();
};

/* Place text anywhere */
canvas.onclick = e => {
  const r = canvas.getBoundingClientRect();
  x = (e.clientX - r.left) * (canvas.width / r.width);
  y = (e.clientY - r.top) * (canvas.height / r.height);
  draw();
};

/* Add text */
function addText() {
  text = textInput.value;
  size = textSize.value;
  color = textColor.value;
  font = fontSelect.value;
  anim = animation.value;
  animate();
}

/* Draw */
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (img) ctx.drawImage(img,0,0,canvas.width,canvas.height);

  ctx.globalAlpha = alpha;
  ctx.font = `${size}px ${font==="sf"?"SF":font==="serif"?"Times New Roman":"Arial"}`;
  ctx.textAlign = "center";

  /* Stroke */
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0,0,0,0.7)";
  ctx.strokeText(text,x,y);

  /* Shadow */
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 12;

  ctx.fillStyle = color;
  ctx.fillText(text,x,y);

  ctx.globalAlpha = 1;
}

/* Animation */
function animate() {
  alpha = anim==="fade" ? 0 : 1;
  scale = anim==="zoom" ? 0.2 : 1;

  const step = () => {
    if (anim==="fade" && alpha < 1) alpha += 0.05;
    if (anim==="zoom" && scale < 1) scale += 0.05;

    ctx.save();
    ctx.translate(x,y);
    ctx.scale(scale,scale);
    ctx.translate(-x,-y);
    draw();
    ctx.restore();

    if ((anim==="fade" && alpha<1) || (anim==="zoom" && scale<1))
      requestAnimationFrame(step);
  };
  step();
}

/* Video preview */
function drawVideo() {
  if (!isVideo) return;
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  draw();
  requestAnimationFrame(drawVideo);
}

/* Download */
function download() {
  const a = document.createElement("a");
  a.download = "export.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}    );
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
