export class Line {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ from, to, style, arrow = {}, polyline }) {
        const ctx = this.ctx;
        // style
        const { strokeStyle, lineWidth } = style || {};

        let firstLine = {
            from: [from[0], from[1]],
            to: [to[0], to[1]],
        };
        let lastLine = {
            from: [from[0], from[1]],
            to: [to[0], to[1]],
        };

        // draw line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(from[0], from[1]);
        if (polyline) {
            let { points, direction, ratios = [1] } = polyline;
            if (points) {
                points.forEach(([x, y]) => {
                    ctx.lineTo(x, y);
                });
                const first = points.at(0);
                const last = points.at(-1);
                firstLine = {
                    from: [from[0], from[1]],
                    to: [first[0], first[1]],
                };
                lastLine = {
                    from: [last[0], last[1]],
                    to: [to[0], to[1]],
                };
            } else {
                if (!direction) {
                    const width = Math.abs(from[0] - to[0]);
                    const height = Math.abs(from[1] - to[1]);
                    // long first
                    if (width > height) {
                        direction = "x";
                    } else {
                        direction = "y";
                    }
                }

                if (direction === "x") {
                    firstLine = {
                        from: [from[0], from[1]],
                        to: [to[0], from[1]],
                    };
                    lastLine = {
                        from: [to[0], from[1]],
                        to: [to[0], to[1]],
                    };
                } else {
                    firstLine = {
                        from: [from[0], from[1]],
                        to: [from[0], to[1]],
                    };
                    lastLine = {
                        from: [from[0], to[1]],
                        to: [to[0], to[1]],
                    };
                }
                ctx.lineTo(firstLine.to[0], firstLine.to[1]);
            }
        }
        ctx.lineTo(to[0], to[1]);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (arrow != false) {
            arrow = arrow || {};
            if (arrow === 2) {
                arrow = {};
                arrow.bidirection = true;
            }
            arrow.strokeStyle == arrow.strokeStyle || strokeStyle;
            this.drawArraw(arrow, firstLine, lastLine);
        }
        ctx.restore();

        // return
        const figure = {};
        return figure;
    }
    drawArraw(arrow, firstLine, lastLine) {
        const { length = 10, fillStyle, strokeStyle, bidirection = false } = arrow;
        if (bidirection) {
            this.drawOneArraw(lastLine.from[0], lastLine.from[1], lastLine.to[0], lastLine.to[1], length, strokeStyle, fillStyle);
            this.drawOneArraw(firstLine.to[0], firstLine.to[1], firstLine.from[0], firstLine.from[1], length, strokeStyle, fillStyle);
        } else {
            this.drawOneArraw(lastLine.from[0], lastLine.from[1], lastLine.to[0], lastLine.to[1], length, strokeStyle, fillStyle);
        }
    }
    drawOneArraw(startX, startY, endX, endY, length, strokeStyle, fillStyle) {
        const ctx = this.ctx;
        // 计算箭头的位置
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx); // 角度
        const arrowLength = length; // 箭头长度
        // 计算箭头的两个顶点
        const arrowX1 = endX - arrowLength * Math.cos(angle - Math.PI / 6);
        const arrowY1 = endY - arrowLength * Math.sin(angle - Math.PI / 6);
        const arrowX2 = endX - arrowLength * Math.cos(angle + Math.PI / 6);
        const arrowY2 = endY - arrowLength * Math.sin(angle + Math.PI / 6);
        // 绘制箭头
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(arrowX1, arrowY1);
        ctx.lineTo(arrowX2, arrowY2);
        ctx.closePath(); // 闭合路径以绘制箭头
        ctx.stroke();
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle || strokeStyle || window.foreground;
        // fill color
        ctx.fill();
    }
}
