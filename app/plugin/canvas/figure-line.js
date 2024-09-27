export class Line {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ from, to, style, arrow }) {
        const ctx = this.ctx;
        // style
        const { strokeStyle, lineWidth } = style || {};

        const startX = from[0];
        const startY = from[1];
        const endX = to[0];
        const endY = to[1];
        // draw line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (arrow) {
            const { length = 10, fillStyle } = arrow;
            // 计算箭头的位置
            const dx = endX - startX;
            const dy = endY - startY;
            const angle = Math.atan2(dy, dx); // 角度
            const arrowLength = length; // 箭头长度
            // 计算箭头的两个顶点
            const arrowX1 = endX - arrowLength * Math.cos(angle - Math.PI / 6);
            const arrowY1 = endY - arrowLength * Math.sin(angle - Math.PI / 6);
            const arrowX2 = endX - arrowLength * Math.cos(angle + Math.PI / 6);
            const arrowY2 = endY - arrowLength * Math.sin(angle + Math.PI / 6);
            // 绘制箭头
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(arrowX1, arrowY1);
            ctx.lineTo(arrowX2, arrowY2);
            ctx.closePath(); // 闭合路径以绘制箭头
            ctx.stroke();
            ctx.fillStyle = fillStyle || strokeStyle || window.foreground;
            // fill color
            ctx.fill();
        }

        ctx.restore();

        // return
        const figure = {};
        return figure;
    }
}
