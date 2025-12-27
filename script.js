const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 1080;

let bgImage = null;
let texts = [];
let draggingText = null;

let audioBlob = null;
let audioURL = null;
let videoFile = null;

/* IMAGE UPLOAD */
document.getElementById("imageInput").addEventListener("change", e => {
  const file = e.target.files[0];
  const img = new Image();
  img.onload = () => {
    bgImage = img;
    draw();
  };
  img.src = URL.createObjectURL(file);
});

/* AUDIO UPLOAD */
document.getElementById("audioInput").addEventListener("change", e => {
  audioBlob = e.target.files[0];
  audioURL = URL.createObjectURL(audioBlob);
  document.getElementById("audioPlayer").src = audioURL;
});

/* VIDEO UPLOAD */
document.getElementById("videoInput").addEventListener("change", e => {
  videoFile = e.target.files[0];
});

/* ADD TEXT */
function addText() {
  texts.push({
    text: document.getElementById("textInput").value,
    x: 200,
    y: 300,
    size: document.getElementById("fontSize").value,
    font: document.getElementById("fontFamily").value,
    anim: document.getElementById("animation").value,
    scale: 1,
    alpha: 1
  });
  draw();
}

/* DRAW */
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (bgImage) ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  texts.forEach(t => {
    ctx.save();
    ctx.globalAlpha = t.alpha;
    ctx.translate(t.x, t.y);
    ctx.scale(t.scale, t.scale);

    ctx.font = `${t.size}px ${t.font}`;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.shadowColor = "black";
    ctx.shadowBlur = 12;

    ctx.strokeText(t.text, 0, 0);
    ctx.fillText(t.text, 0, 0);
    ctx.restore();
  });
}

/* TEXT DRAG */
canvas.addEventListener("mousedown", e => {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * canvas.width / r.width;
  const y = (e.clientY - r.top) * canvas.height / r.height;

  texts.forEach(t => {
    if (x > t.x && x < t.x + 400 && y < t.y && y > t.y - t.size) {
      draggingText = t;
    }
  });
});

canvas.addEventListener("mousemove", e => {
  if (!draggingText) return;
  const r = canvas.getBoundingClientRect();
  draggingText.x = (e.clientX - r.left) * canvas.width / r.width;
  draggingText.y = (e.clientY - r.top) * canvas.height / r.height;
  draw();
});

canvas.addEventListener("mouseup", () => draggingText = null);

/* DOWNLOAD IMAGE */
function downloadImage() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "image.png";
  link.click();
}

/* EXTRACT AUDIO FROM VIDEO */
function extractAudio() {
  if (!videoFile) return alert("Upload video first");

  const video = document.createElement("video");
  video.src = URL.createObjectURL(videoFile);

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(video);
  const dest = audioCtx.createMediaStreamDestination();

  source.connect(dest);
  source.connect(audioCtx.destination);

  const recorder = new MediaRecorder(dest.stream);
  let chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    audioBlob = new Blob(chunks, {type:"audio/webm"});
    audioURL = URL.createObjectURL(audioBlob);
    document.getElementById("audioPlayer").src = audioURL;
  };

  video.onplay = () => recorder.start();
  video.onended = () => recorder.stop();

  video.play();
}

/* EXPORT VIDEO WITH AUDIO */
function exportVideo() {
  if (!audioBlob) return alert("Add audio first");

  const stream = canvas.captureStream(30);
  const audio = new Audio(audioURL);

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
  const dest = audioCtx.createMediaStreamDestination();
  source.connect(dest);
  source.connect(audioCtx.destination);

  const mixed = new MediaStream([
    ...stream.getVideoTracks(),
    ...dest.stream.getAudioTracks()
  ]);

  const recorder = new MediaRecorder(mixed);
  let chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, {type:"video/webm"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "final_video.webm";
    link.click();
  };

  audio.play();
  recorder.start();
  setTimeout(() => recorder.stop(), audio.duration * 1000);
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bg) ctx.drawImage(bg, 0, 0);

  if (textObj) {
    ctx.font = `${textObj.size}px -apple-system, Arial`;
    ctx.textAlign = "center";

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeText(textObj.text, textObj.x, textObj.y);

    ctx.fillStyle = "white";
    ctx.fillText(textObj.text, textObj.x, textObj.y);
  }
}

canvas.addEventListener("pointerdown", e => {
  dragging = true;
});

canvas.addEventListener("pointermove", e => {
  if (!dragging || !textObj) return;
  const rect = canvas.getBoundingClientRect();
  textObj.x = e.clientX - rect.left;
  textObj.y = e.clientY - rect.top;
  draw();
});

canvas.addEventListener("pointerup", () => dragging = false);

function download() {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "text-editor.png";
  a.click();
}
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
