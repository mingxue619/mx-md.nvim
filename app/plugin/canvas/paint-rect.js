export class Rect {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw(params) {
        const { position, size, style, children } = params;
        const ctx = this.ctx;
        ctx.save();
        let [x, y] = position;
        const [width, height] = size;
        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
        // style
        const { strokeStyle, lineWidth, fill, fillStyle, lineDash } = style || {};
        // draw
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(from.x + width, from.y); // 从左上角到右上角
        ctx.lineTo(from.x + width, from.y + height); // 从右上角到右下角
        ctx.lineTo(from.x, from.y + height); // 从右下角到左下角
        ctx.closePath(); // 闭合路径，即从左下角回到左上角
        // 绘制边框
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        if(lineDash) {
            ctx.setLineDash(lineDash);
        }
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
            type: "rect",
            params: params,
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
