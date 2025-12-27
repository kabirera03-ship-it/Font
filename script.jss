const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let emoji = "❤️";
let emojiX = 200;
let emojiY = 200;

document.getElementById("upload").addEventListener("change", e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  draw();
};

document.getElementById("quote").addEventListener("input", draw);

function draw() {
  ctx.drawImage(img, 0, 0);

  // Dark overlay
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = "#ff9db5";
  ctx.font = "40px 'Times New Roman'";
  ctx.textAlign = "center";
  ctx.fillText(
    "“The Weight of Wanting to Be Enough”",
    canvas.width / 2,
    80
  );

  // Body text
  ctx.fillStyle = "white";
  ctx.font = "26px 'Times New Roman'";
  wrapText(
    document.getElementById("quote").value,
    canvas.width / 2,
    140,
    canvas.width * 0.8,
    34
  );

  // Emoji
  ctx.font = "60px Arial";
  ctx.fillText(emoji, emojiXx = emojiX, emojiY);
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// Drag emoji
canvas.addEventListener("mousedown", e => {
  emojiX = e.offsetX;
  emojiY = e.offsetY;
  draw();
});

function download() {
  const link = document.createElement("a");
  link.download = "quote.jpg";
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
}
