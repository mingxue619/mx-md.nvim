export class Cylinder {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({centerX, centerY, radius, height, color}) {
        const ctx = this.ctx;
        ctx.save();

        // 设置填充颜色
        ctx.fillStyle = color;

        // 绘制顶部圆
        ctx.beginPath();
        ctx.arc(centerX, centerY - height / 2, radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制底部圆
        ctx.beginPath();
        ctx.arc(centerX, centerY + height / 2, radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制侧面
        ctx.beginPath();
        ctx.moveTo(centerX + radius, centerY - height / 2);
        ctx.lineTo(centerX + radius, centerY + height / 2);
        ctx.lineTo(centerX - radius, centerY + height / 2);
        ctx.lineTo(centerX - radius, centerY - height / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}
