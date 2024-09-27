export class Cylinder {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ position, size, style, children }) {
        const ctx = this.ctx;
        ctx.save();
        let [x, y] = position;
        const [width, height, radiusY] = size;

        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
        const radiusX = width / 2;
        ctx.beginPath();
        // draw ellipse at top
        //ctx.ellipse(x, from.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        // draw rect
        ctx.moveTo(from.x + width, from.y);
        ctx.lineTo(from.x + width, from.y + height);
        ctx.ellipse(x, from.y + height, radiusX, radiusY, 0, 0, Math.PI);
        ctx.moveTo(from.x, from.y + height);
        ctx.lineTo(from.x, from.y);
        ctx.closePath(); 
        // style
        const { strokeStyle, lineWidth, fill, fillStyle } = style || {};
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        // fill
        if (fill) {
            ctx.fillStyle = fillStyle || window.foreground; 
            ctx.fill();
        }
        ctx.restore();
    }
}
