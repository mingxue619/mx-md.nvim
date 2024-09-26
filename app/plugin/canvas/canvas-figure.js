// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点
function Figure(ctx) {
    return {
        rect: function ({ position, size, color, label }) {
            ctx.save();
            // figure
            let [x, y] = position;
            const [width, height] = size;
            if (color) {
                ctx.fillStyle = color;
            }
            const fromX = x - width / 2;
            const fromY = y - height / 2;
            ctx.fillRect(fromX, fromY, width, height);
            ctx.restore();
            // label
            const align = label.align || {};
            align.frame = {
                left: fromX,
                right: fromX + width,
                top: fromY,
                bottom: fromY + height,
            };
            label.align = align;
            this.label(label);

        },
        label: function ({ title, font, color, align, position }) {
            ctx.save();
            ctx.font = font || "16px Hack Nerd Font Mono";
            ctx.fillStyle = color;

            let textWidth = ctx.measureText(title).width;
            var textHeight = parseInt(ctx.font, 10);

            let [x, y] = [0, 0];
            if (position) {
                x = position.x - textWidth / 2;
                y = position.y + textHeight / 2;
            } else {
                let { frame = { left: 0, right: 100, top: 0, bottom: 100, padding: 1 }, v = "center", h = "center" } = align || {};
                if (h === "left") {
                    x = frame.left + frame.padding;
                } else if (h === "right") {
                    x = frame.right - textWidth - frame.padding;
                } else if (h === "center") {
                    const fw = frame.right - frame.left;
                    let spaceW = fw - textWidth;
                    spaceW = spaceW > 0 ? spaceW : 0;
                    x = frame.left + spaceW / 2;
                } else {
                    throw new Error("label.align.h is error");
                }
                if (v === "top") {
                    y = frame.top + textHeight;
                } else if (v === "bottom") {
                    y = frame.bottom + frame.padding;
                } else {
                    const fh = frame.bottom - frame.top;
                    let spaceH = fh - textHeight;
                    spaceH = spaceH > 0 ? spaceH : 0;
                    // y = frame.top + spaceH / 2 + textHeight;
                    y = frame.bottom - spaceH /2;
                }
            }

            ctx.fillText(title, x, y);
            ctx.restore();
        },
    };
}
