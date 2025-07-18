export class Label {
    constructor(ctx) {
        this.ctx = ctx;
    }
    static build(ctx) {
        return new Label(ctx);
    }
    _parseRatioFromValue(value) {
        // "1/2*-1"
        const match = value.match(/^([^*]*)\*(.*)$/) || [, value];
        const ratio = match[1] !== undefined ? match[1] : "0";
        const offset = match[2] !== undefined ? match[2] : "0";
        return { ratio, offset };
    }
    buildShape(params) {
        if (typeof params === "string") {
            params = {
                title: params,
            };
        }
        this.params = params;
        let { title, lineSpace, font, color, position, parentsFrame, top, right, bottom, left, offset } = params;
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
        // position
        if (!position) {
            let x = 0;
            let y = 0;
            // align
            const horizontal = (left !==undefined)  ? "left" : (right !== undefined) ? "right" : "center";
            const vertical = (top !== undefined) ? "top" : (bottom !== undefined) ? "bottom" : "center";
            const { top: ptop, right: pright, bottom: pbottom, left: pleft } = parentsFrame;
            const pwidth = pright - pleft;
            const pheight = pbottom - ptop;
            const parseAlignValue = (value) => {
                value = String(value);
                const match = value.match(/^([^*]*)\*(.*)$/) || [, value];
                const parseRatio = (str) => {
                    if (!str.trim()) return 0;
                    if (str.includes("/")) {
                        const [num, den] = str.split("/").map((v) => parseFloat(v) || 0);
                        return den === 0 ? 0 : num / den;
                    }
                    return parseFloat(str) || 0;
                };
                const parseValue = (str) => {
                    return parseFloat(str.trim()) || 0;
                };
                return {
                    ratio: parseRatio(match[1] || ""),
                    value: parseValue(match[2] || ""),
                };
            };
            if (horizontal === "left") {
                const { ratio, value } = parseAlignValue(left);
                x = pleft + ratio * pwidth + value + width / 2;
            } else if (horizontal === "right") {
                const { ratio, value } = parseAlignValue(right);
                x = pright - ratio * pwidth + value - width / 2;
            } else {
                x = pleft + pwidth / 2;
            }
            if (vertical === "top") {
                const { ratio, value } = parseAlignValue(top);
                y = ptop + ratio * pheight + value + height / 2;
            } else if (vertical === "bottom") {
                const { ratio, value } = parseAlignValue(bottom);
                y = pbottom - ratio * pheight + value - height / 2;
            } else {
                y = ptop + pheight / 2;
            }
            // offset = [1, 1]
            if (!!offset) {
                const [ox, oy] = offset;
                x = x + ox;
                y = y + oy;
            }
            position = [x, y];
        }

        // startX, startY
        const [x, y] = position;
        let startX = x - width / 2;
        let startY = y - height / 2;
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

    buildShapeWithFrame(labelParams, parentsFrame) {
        if (!labelParams) {
            return undefined;
        }
        if (typeof labelParams === "string") {
            labelParams = {
                title: labelParams,
            };
        }
        labelParams.parentsFrame = parentsFrame;
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
