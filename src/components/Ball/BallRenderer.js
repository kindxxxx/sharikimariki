export class BallRenderer {
  constructor() {
    this.flagImages = {};
    this.radius = 12;
  }

  preloadFlags(countries) {
    countries.forEach(country => {
      if (!this.flagImages[country.id]) {
        const img = new Image();
        img.src = country.flag;
        this.flagImages[country.id] = img;
      }
    });
  }

  drawCircularBall(ctx, ball) {
    const flag = ball.plugin?.flag;
    if (!flag) return;

    const img = this.flagImages[flag.id];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const pos = ball.position;
    const r = this.radius;

    ctx.save();
    
    // Вписываем флаг в идеальный круг
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const size = r * 2;
    ctx.drawImage(img, pos.x - r, pos.y - r, size, size);

    ctx.restore();

    // Защитная обводка
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

export const ballRenderer = new BallRenderer();
