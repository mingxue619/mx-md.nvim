// const figure = new Figure(canvas);
// const ecs = figure.rect({
//     position: [200, 100], 
//     size: [100, 100], 
//     style: {
//         strokeStyle: "black",
//         lineWidth: 1,
//         fill: false,
//         fillStyle: "black"
//     },
//     label: {
//         title: "ECS",
//         color: "black",
//         align: {
//             v: "top",
//             margin: 10,
//         }
//     },
//     children: function(parents) {
//         figure.rect({
//             position: [parents.position[0], parents.position[1] + 20], 
//             size: [90, 30], 
//             //color: "blue",
//             label: {
//                 title: "sharding",
//                 //color: "red",
//             }
//         });
//     }
// });

export class Rect {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ position, size, style, label, children }) {
        const ctx = this.ctx;
        ctx.save();
        let [x, y] = position;
        const [width, height] = size;
        let from = {
            x: x - width / 2,
            y: y - height / 2,
        };
        // style
        const { strokeStyle, lineWidth, fill, fillStyle } = style || {};
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
        ctx.stroke();
        // 设置填充颜色
        if (fill) {
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }
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
