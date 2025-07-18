export class Label {
    constructor(ctx) {
        this.ctx = ctx;
    }
    static build(ctx) {
        return new Label(ctx);
    }
    buildShape(params) {
        if (typeof params === "string") {
            params = {
                title: params,
            };
        }
        this.params = params;
        let { title, lineSpace, font, color, align, position } = params;
        this.font = font || "16px Hack Nerd Font Mono";
        this.fillStyle = color || window.foreground;

        const ctx = this.ctx;
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;

        let width = 0;
        let height = 0;
        const lineHeight = parseInt(ctx.font, 10);
        lineSpace = lineSpace || lineHeight / 4;

        const lines = title.split("<br>");
        lines.forEach((line) => {
            let lineWidth = ctx.measureText(line).width;
            width = Math.max(width, lineWidth);
            height = height + lineHeight;
        });
        let [startX, startY] = [0, 0]; // start point, [left, top]
        if (position) {
            startX = position[0] - width / 2;
            startY = position[1] + height / 2;
        } else {
            // h: left, right, center; v: top, bottom,center; frame: left,right,top bottom
            let { frame = { left: 0, right: 100, top: 0, bottom: 100 }, margin, v = "center", h = "center" } = align || {};
            const { marginTop, marginRight, marginBottom, marginLeft } = this.parseMargin(margin);
            if (h === "left") {
                startX = frame.left + marginLeft;
            } else if (h === "right") {
                startX = frame.right - width - marginRight;
            } else if (h === "center") {
                const fw = frame.right - frame.left;
                let spaceW = fw - width;
                spaceW = spaceW > 0 ? spaceW : 0;
                startX = frame.left + spaceW / 2;
                startX = startX + marginLeft - marginRight;
            } else {
                throw new Error("label.align.h is error");
            }
            if (v === "top") {
                startY = frame.top + marginTop;
            } else if (v === "bottom") {
                startY = frame.bottom - height - marginBottom;
            } else {
                const fh = frame.bottom - frame.top;
                let spaceH = fh - height;
                spaceH = spaceH > 0 ? spaceH : 0;
                startY = frame.top + spaceH / 2;
                startY = startY + marginTop - marginBottom;
            }
        }
        let trackPoints = [];
        lines.forEach((line) => {
            const lineWidth = ctx.measureText(line).width;
            const spaceW = width - lineWidth;
            startY = startY + lineHeight;
            trackPoints.push({
                text: line,
                startX: startX + spaceW / 2,
                startY: startY,
            });
            startY = startY + lineSpace;
        });
        this.trackPoints = trackPoints;
        ctx.restore();

        // return
        let shape = {
            type: "label",
            brush: this,
            position: void 0,
            frame: void 0,
            outline: void 0,
            trackPoints,
        };
        return shape;
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

    buildShapeWithFrame(labelParams, frame) {
        if (!labelParams) {
            return undefined;
        }
        if (typeof labelParams === "string") {
            labelParams = {
                title: labelParams,
            };
        }
        (labelParams.align ??= {}).frame = frame;
        return this.buildShape(labelParams);
    }
    draw(theme) {
        const ctx = this.ctx;

        const trackPoints = this.trackPoints;

        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle || theme.foreground;
        trackPoints.forEach((trackPoint) => {
            const { text, startX, startY } = trackPoint;
            ctx.fillText(text, startX, startY);
        });

        ctx.restore();
    }
}
