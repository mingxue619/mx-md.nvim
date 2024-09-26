export class Label {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw({ title, font, color, align, position }) {
        const ctx = this.ctx;
        ctx.save();
        ctx.font = font || "16px Hack Nerd Font Mono";
        if(color) {
            ctx.fillStyle = color;
        } else {
            ctx.fillStyle = window.foreground;
        }

        let textWidth = ctx.measureText(title).width;
        var textHeight = parseInt(ctx.font, 10);

        let [x, y] = [0, 0];
        if (position) {
            x = position.x - textWidth / 2;
            y = position.y + textHeight / 2;
        } else {
            let { frame = { left: 0, right: 100, top: 0, bottom: 100 }, margin = 1, v = "center", h = "center" } = align || {};
            if (h === "left") {
                x = frame.left + margin;
            } else if (h === "right") {
                x = frame.right - textWidth - margin;
            } else if (h === "center") {
                const fw = frame.right - frame.left;
                let spaceW = fw - textWidth;
                spaceW = spaceW > 0 ? spaceW : 0;
                x = frame.left + spaceW / 2;
            } else {
                throw new Error("label.align.h is error");
            }
            if (v === "top") {
                y = frame.top + textHeight + margin;
            } else if (v === "bottom") {
                y = frame.bottom + margin;
            } else {
                const fh = frame.bottom - frame.top;
                let spaceH = fh - textHeight;
                spaceH = spaceH > 0 ? spaceH : 0;
                // y = frame.top + spaceH / 2 + textHeight;
                y = frame.bottom - spaceH / 2;
            }
        }

        ctx.fillText(title, x, y);
        ctx.restore();
    }
}
