import type { GenerateTop8ImageParams } from "./types";

// Helper to load an image from a data URL
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const generateTop8Image = async ({
  canvas,
  title,
  date,
  backgroundImagePreview,
  primaryColor,
  secondaryColor,
  players,
}: GenerateTop8ImageParams) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Canvas size (reference image is 1920x1080, but you can adjust)
  const width = 1920;
  const height = 1080;
  canvas.width = width;
  canvas.height = height;

  // Draw background (solid color first)
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, width, height);

  // Draw background image if present
  if (backgroundImagePreview) {
    const bgImg = await loadImage(backgroundImagePreview);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(bgImg, 0, 0, width, height);
    ctx.globalAlpha = 1.0;
  }

  // Draw title
  ctx.save();
  ctx.font = "bold 64px Impact, Arial Black, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = primaryColor;
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 8;
  ctx.strokeText(title || "TOP 8", width / 2, 110);
  ctx.fillText(title || "TOP 8", width / 2, 110);
  ctx.restore();

  // Draw date (bottom right)
  ctx.save();
  ctx.font = "bold 32px monospace";
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.8;
  const dateText = date
    ? (() => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
      })()
    : "";
  ctx.fillText(dateText, width - 60, height - 40);
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // Player box layout (similar to your reference)
  // 1st: big left, 2-4: top right, 5-8: bottom right
  // Coordinates and sizes
  const playerBoxes = [
    // 1st place (big)
    { x: 80, y: 180, w: 550, h: 560 },
    // 2nd-4th (medium)
    { x: 670, y: 180, w: 300, h: 300 },
    { x: 1000, y: 180, w: 300, h: 300 },
    { x: 1330, y: 180, w: 300, h: 300 },
    // 5th-8th (small)
    { x: 670, y: 520, w: 220, h: 220 },
    { x: 915, y: 520, w: 220, h: 220 },
    { x: 1160, y: 520, w: 220, h: 220 },
    { x: 1410, y: 520, w: 220, h: 220 },
  ];

  for (let i = 0; i < 8; i++) {
    const player = players[i];
    const box = playerBoxes[i];
    // Draw player box background
    ctx.save();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 6;
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.w, box.h);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Draw player image
    if (player.imagePreview) {
      const img = await loadImage(player.imagePreview);
      ctx.save();
      ctx.beginPath();
      ctx.rect(box.x + 8, box.y + 8, box.w - 16, box.h - 16);
      ctx.clip();
      ctx.drawImage(img, box.x + 8, box.y + 8, box.w - 16, box.h - 60);
      ctx.restore();
    }

    // Draw position number
    ctx.save();
    ctx.fillStyle = primaryColor;
    ctx.fillRect(box.x, box.y, 48, 48);
    ctx.font = "bold 36px Arial Black, Arial, sans-serif";
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((i + 1).toString(), box.x + 24, box.y + 24);
    ctx.restore();

    // Draw tag label
    ctx.save();
    ctx.fillStyle = primaryColor;
    ctx.fillRect(box.x, box.y + box.h - 48, box.w, 48);
    ctx.font = "bold 28px Arial Black, Arial, sans-serif";
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      player.tag || `TAG Player ${i + 1}`,
      box.x + box.w / 2,
      box.y + box.h - 24
    );
    ctx.restore();
  }
};
