export class Cylinder {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ position, size, style, children }) {
        debugger
        const ctx = this.ctx;
        ctx.save();
        let [x, y] = position;
        const [width, height, radiusY] = size;

        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
        const radiusX = width / 2;
        const rotation = 0; //旋转角度(弧度)
        const startAngle = Math.PI; // 开始角度
        const endAngle = 2 * Math.PI; //结束角度
        ctx.beginPath();
        //ctx.ellipse(from.x, from.y, radiusX, radiusY, rotation, startAngle, endAngle);

        // style
        const { strokeStyle, lineWidth, fill, fillStyle } = style || {};
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

    }
}
