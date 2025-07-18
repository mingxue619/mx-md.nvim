// position in triangle
export class Triangle {
    constructor(ctx) {
        this.ctx = ctx;
    }
    static build(ctx) {
        return new Triangle(ctx);
    }
    buildShape(params) {
        this.params = params;
        const { position, size, style, children } = params;

        let [x, y] = position;
        const [width, height] = size;
        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
        let trackPoints = [];
        trackPoints.push([from.x + width / 2, from.y]); // 上顶点
        trackPoints.push([from.x + width, from.y + height]); // 右下角
        trackPoints.push([from.x, from.y + height]); // 左下角
        this.trackPoints = trackPoints;

        // return
        const point = {
            top: [x, y - height / 2],
            right: [x + width / 4, y],
            bottom: [x, y + height / 2],
            left: [x - width / 4, y],
        };
        const frame = {
            left: from.x,
            right: from.x + width,
            top: from.y,
            bottom: from.y + height,
        };

        let shape = {
            type: "triangle",
            brush: this,
            position: position,
            x: x,
            y: y,
            width, 
            height,
            point: point,
            frame: frame,
            outline: frame,
            trackPoints,
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
        const ctx = this.ctx;
        const params = this.params;
        const { position, size, style, children } = params;

        // style
        const { strokeStyle, lineWidth, fill, fillStyle } = style || {};

        const trackPoints = this.trackPoints;
        // draw
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(trackPoints[0][0], trackPoints[0][1]);
        for (let i = 1; i < trackPoints.length; i++) {
            ctx.lineTo(trackPoints[i][0], trackPoints[i][1]);
        }
        ctx.closePath();

        // 绘制边框
        ctx.strokeStyle = strokeStyle || theme.foreground;
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
