export class Circle {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ position, size, style, children }) {
        const ctx = this.ctx;
        ctx.save();
        let [x, y] = position;
        const [radius] = size;
        // style
        const { strokeStyle, lineWidth, fill, fillStyle } = style || {};
        // draw
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
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
        const width = radius * 2;
        const height = radius * 2;
        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
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

        let shape = {
            type: "circle",
            point: point,
            position: position,
            frame: frame,
            outline: frame,
        };
        // children
        if (children) {
            const childrenObjects = children(shape);
            if (childrenObjects) {
                return {
                    ...shape,
                    children: childrenObjects,
                };
            }
        }
        return shape;
    }
}
