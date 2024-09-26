export class Rect {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ position, size, color, label, children }) {
        const ctx = this.ctx;
        ctx.save();
        // figure
        let [x, y] = position;
        const [width, height] = size;
        if (color) {
            ctx.fillStyle = color;
        }
        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
        ctx.fillRect(from.x, from.y, width, height);
        ctx.restore();
        // return
        const frame = {
            left: from.x,
            right: from.x + width,
            top: from.y,
            bottom: from.y + height,
        };
        let figure = {
            rect: {
                x: from.x,
                y: from.y,
                width: width,
                height: height,
            },
            position: position,
            frame: frame,
        };
        // children
        if (children) {
            children(figure);
        }
        return figure;
    }
}
