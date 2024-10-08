export class Ellipse {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ position, size, style, children }) {
        const ctx = this.ctx;
        ctx.save();
        let [x, y] = position;
        const [radiusX, radiusY] = size;
        const width = radiusX * 2, height = radiusY * 2;
        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
        // style
        const { strokeStyle, lineWidth, fill, fillStyle } = style || {};
        // draw
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        // 绘制边框
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
            top: [x, y - height / 2],
            right: [x + width / 2, y],
            bottom: [x, y + height / 2],
            left: [x - width / 2, y],
        };
        const frame = {
            left: from.x,
            right: from.x + width,
            top: from.y,
            bottom: from.y + height,
        };

        let figure = {
            type: "ellipse",
            point: point,
            position: position,
            frame: frame,
        };
        // children
        if (children) {
            const childrenObjects = children(figure);
            if (childrenObjects) {
                return {
                    ...figure,
                    children: childrenObjects,
                };
            }
        }
        return figure;
    }
}
