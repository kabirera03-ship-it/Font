const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 220;

let textX = canvas.width / 2;
let textY = 120;

let emojiX = 60;
let emojiY = 200;

const emoji = new Image();
emoji.src = "heart.png"; // iPhone emoji PNG

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // TEXT
  const text = document.getElementById("textInput").value;
  const fontSize = document.getElementById("fontSize").value;
  const lineHeight = document.getElementById("lineHeight").value;

  ctx.fillStyle = "white";
  ctx.font = `${fontSize}px Times New Roman`;
  ctx.textAlign = "center";

  let lines = text.split("\n");
  lines.forEach((line, i) => {
    ctx.fillText(line, textX, textY + i * lineHeight);
  });

  // EMOJI
  ctx.drawImage(emoji, emojiX, emojiY, 48, 48);
}

setInterval(draw, 30);

// MOVE TEXT OR EMOJI
let dragging = null;

canvas.addEventListener("mousedown", e => {
  const x = e.offsetX;
  const y = e.offsetY;

  if (x > emojiX && x < emojiX + 48 && y > emojiY && y < emojiY + 48) {
    dragging = "emoji";
  } else {
    dragging = "text";
  }
});

canvas.addEventListener("mousemove", e => {
  if (!dragging) return;

  if (dragging === "emoji") {
    emojiX = e.offsetX;
    emojiY = e.offsetY;
  } else {
    textX = e.offsetX;
    textY = e.offsetY;
  }
});

canvas.addEventListener("mouseup", () => dragging = null);
