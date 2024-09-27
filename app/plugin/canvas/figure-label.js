export class Label {
    constructor(ctx) {
        this.ctx = ctx;
    }
    parseMargin(margin) {
        let marginTop = 0,
            marginRight = 0,
            marginBottom = 0,
            marginLeft = 0;
        if (typeof margin === "number") {
            marginTop = marginRight = marginBottom = marginLeft = margin;
        } else if (typeof margin === "object") {
            if (margin instanceof Array) {
                marginTop = margin[0] || 0;
                marginRight = margin[1] || 0;
                marginBottom = margin[2] || 0;
                marginLeft = margin[3] || 0;
            } else {
                marginTop = margin.top || 0;
                marginRight = margin.right || 0;
                marginBottom = margin.bottom || 0;
                marginLeft = margin.left || 0;
            }
        }
        return { marginTop, marginRight, marginBottom, marginLeft };
    }
    draw(params) {
        if (typeof params === "string") {
            params = {
                title: params,
            };
        }
        const { title, font, color, align, position } = params;
        const ctx = this.ctx;
        ctx.save();
        ctx.font = font || "16px Hack Nerd Font Mono";
        ctx.fillStyle = color || window.foreground;
        let textWidth = ctx.measureText(title).width;
        var textHeight = parseInt(ctx.font, 10);

        let [x, y] = [0, 0];
        if (position) {
            x = position[0] - textWidth / 2;
            y = position[1] + textHeight / 2;
        } else {
            // h: left, right, center; v: top, bottom,center; frame: left,right,top bottom
            let { frame = { left: 0, right: 100, top: 0, bottom: 100 }, margin, v = "center", h = "center" } = align || {};
            const { marginTop, marginRight, marginBottom, marginLeft } = this.parseMargin(margin);
            debugger
            if (h === "left") {
                x = frame.left + marginLeft;
            } else if (h === "right") {
                x = frame.right - textWidth - marginRight;
            } else if (h === "center") {
                const fw = frame.right - frame.left;
                let spaceW = fw - textWidth;
                spaceW = spaceW > 0 ? spaceW : 0;
                x = frame.left + spaceW / 2;
            } else {
                throw new Error("label.align.h is error");
            }
            if (v === "top") {
                y = frame.top + textHeight + marginTop;
            } else if (v === "bottom") {
                y = frame.bottom + marginBottom;
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
