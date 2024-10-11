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
        ctx.ellipse(x, from.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        // draw bottom
        ctx.moveTo(from.x + width, from.y);
        ctx.lineTo(from.x + width, from.y + height);
        ctx.ellipse(x, from.y + height, radiusX, radiusY, 0, 0, Math.PI);
        ctx.lineTo(from.x, from.y);
        //ctx.closePath();
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
        // return
        const point = {
            top: [x, y - height / 2 - radiusY],
            right: [x + width / 2, y],
            bottom: [x, y + height / 2 + radiusY],
            left: [x - width / 2, y],
        };
        const frame = {
            left: from.x,
            right: from.x + width,
            top: from.y,
            bottom: from.y + height,
        };
        const outline = {
            left: from.x,
            right: from.x + width,
            top: from.y - radiusY,
            bottom: from.y + height + radiusY,
        };
        let figure = {
            type: "cylinder",
            point: point,
            position: position,
            frame: frame,
            outline: outline,
        };
        // children
        if (children) {
            children(figure);
        }
        return figure;
    }
}
