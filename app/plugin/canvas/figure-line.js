export class Line {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ from, to, style }) {
        debugger;
        const ctx = this.ctx;
        // style
        const { strokeStyle, lineWidth } = style || {};

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(from[0], from[1]);
        ctx.lineTo(to[0], to[1]); // 从左上角到右上角
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.restore();
    }
}
