export class Rect {
    constructor(ctx) {
        this.ctx = ctx;
    }
    static build(ctx) {
        return new Rect(ctx);
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
        trackPoints.push([from.x, from.y]); //左上
        trackPoints.push([from.x + width, from.y]); // 右上角
        trackPoints.push([from.x + width, from.y + height]); // 右下角
        trackPoints.push([from.x, from.y + height]); // 左下角
        this.trackPoints = trackPoints;

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

        let shape = {
            type: "rect",
            brush: this,
            position: position,
            point: point,
            frame: frame,
            outline: frame,
            trackPoints,
        };
        // children
        if (children) {
            const childrenShapes = children(shape);
            if (childrenShapes) {
                return {
                    ...shape,
                    children: childrenShapes,
                };
            }
        }
        return shape;
    }
    draw() {
        const ctx = this.ctx;
        const params = this.params;
        const { position, size, style, children } = params;
        // style
        const { strokeStyle, lineWidth, fill, fillStyle, lineDash } = style || {};

        const trackPoints = this.trackPoints;

        // draw
        ctx.save();
        ctx.beginPath();

        ctx.moveTo(trackPoints[0][0], trackPoints[0][1]);
        for (let i = 1; i < trackPoints.length; i++) {
            ctx.lineTo(trackPoints[i][0], trackPoints[i][1]);
        }
        ctx.closePath(); // 闭合路径，即从左下角回到左上角
        // 绘制边框
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        if (lineDash) {
            ctx.setLineDash(lineDash);
        }
        ctx.stroke();
        // fill
        if (fill) {
            ctx.fillStyle = fillStyle || window.foreground;
            ctx.fill();
        }
        ctx.restore();
    }
}
