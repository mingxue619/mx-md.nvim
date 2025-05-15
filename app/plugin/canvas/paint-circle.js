export class Circle {
    constructor(ctx) {
        this.ctx = ctx;
    }
    static build(ctx) {
        return new Circle(ctx);
    }
    buildShape(params) {
        this.params = params;
        const { position, size, style, children } = params;

        let [x, y] = position;
        const [radius] = size;
        // draw
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
            brush: this,
            position: position,
            point: point,
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
    draw(theme) {
        const { position, size, style, children } = this.params;
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
        ctx.strokeStyle = strokeStyle || theme.foreground;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        // fill
        if (fill) {
            ctx.fillStyle = fillStyle || theme.foreground;
            ctx.fill();
        }
        ctx.restore();
    }
}
