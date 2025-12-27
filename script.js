const canvas = document.getElementById("canvas");
const bg = document.getElementById("bg");
const video = document.getElementById("video");

let activeText = null;

/* Upload image */
document.getElementById("imgInput").addEventListener("change", e => {
  bg.src = URL.createObjectURL(e.target.files[0]);
  video.src = "";
});

/* Upload video */
document.getElementById("videoInput").addEventListener("change", e => {
  video.src = URL.createObjectURL(e.target.files[0]);
  bg.src = "";
});

/* Add text */
document.getElementById("addText").onclick = () => {
  const t = document.createElement("div");
  t.className = "text";
  t.contentEditable = true;
  t.innerHTML = "Write here ❤️";
  canvas.appendChild(t);
  activeText = t;
  drag(t);
  twemoji.parse(t);
};

/* Color */
document.getElementById("colorPicker").oninput = e => {
  if (activeText) activeText.style.color = e.target.value;
};

/* Font size */
document.getElementById("fontSize").oninput = e => {
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
