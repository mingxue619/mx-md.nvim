export class Axes {
    constructor(canvas, ctx) {
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    draw() {
        this.ctx.save();
        this.ctx.strokeStyle = "red";
        this.ctx.fillStyle = "red";
        this.drawAxes(this.width, this.height);
        this.drawTicks(this.width, this.height);
        this.ctx.restore();
    }
    // 绘制坐标轴
    drawAxes(width, height) {
        const ctx = this.ctx;
        // 设置虚线样式，这里实线长度为10，空白长度为5
        ctx.setLineDash([5, 10]);
        // 设置虚线开始的偏移量（可选）
        ctx.lineDashOffset = 0;
        // X轴
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineWidth = 2;
        ctx.stroke();
        this.drawArrow(0, 0, width, 0, "X");

        // Y轴
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.lineWidth = 2;
        ctx.stroke();
        this.drawArrow(0, 0, 0, height, "Y");
        // 重置虚线样式为实线
        ctx.setLineDash([]); // 重置虚线样式为实线
    }
    // 绘制箭头
    drawArrow(fromX, fromY, toX, toY, label) {
        const ctx = this.ctx;
        const headlen = 10; // 箭头长度
        const angle = Math.atan2(toY - fromY, toX - fromX);
        //ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();

        ctx.font = "16px Hack Nerd Font Mono";
        ctx.fillText(label, toX + (label === "X" ? -20 : 10), toY + (label === "Y" ? -10 : 20));
    }

    // 绘制坐标刻度
    drawTicks(width, height) {
        const ctx = this.ctx;

        // X轴刻度
        for (let i = 0; i < width; i += 100) {
            if (i === 0) {
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(i, -5);
            ctx.lineTo(i, 5);
            ctx.lineWidth = 1;
            ctx.fillText(i, i - 15, 20); // X轴刻度数值
            ctx.stroke();
        }

        // Y轴刻度
        for (let i = 0; i < height; i += 100) {
            if (i === 0) {
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(-5, i);
            ctx.lineTo(+5, i);
            ctx.lineWidth = 1;
            ctx.fillText(i, 5, i + 5); // Y轴刻度数值
            ctx.stroke();
        }
    }
}
