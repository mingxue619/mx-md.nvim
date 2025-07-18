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
        let { title, lineSpace, font, color, position, parentsFrame, top, right, bottom, left } = params;
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
            const horizontal = left ? "left" : right ? "right" : "center";
            const vertical = top ? "top" : bottom ? "bottom" : "center";
            const { top: ptop, right: pright, bottom: pbottom, left: pleft } = parentsFrame;
            const pwidth = pright - pleft;
            const pheight = pbottom - ptop;
            const parseAlignValue = (value) => {
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
            debugger;
            if (horizontal === "left") {
                const { ratio, value } = parseAlignValue(left);
                if (ratio === 0) {
                    x = pleft + value;
                } else {
                    x = pleft + ratio * pwidth - width / 2 + value;
                }
            } else if (horizontal === "right") {
                const { ratio, value } = parseAlignValue(right);
                if (ratio === 0) {
                    x = pright + value;
                } else {
                    x = pright - ratio * pwidth - width / 2 + value;
                }
            } else {
                x = pleft + pwidth / 2 - width / 2;
            }
            if (vertical === "top") {
                const { ratio, value } = parseAlignValue(top);
                if (ratio === 0) {
                    y = ptop + value;
                } else {
                    y = ptop + ratio * pheight + height / 2 + value;
                }
            } else if (vertical === "bottom") {
                const { ratio, value } = parseAlignValue(bottom);
                if (ratio === 0) {
                    y = pbottom - +value;
                } else {
                    y = pbottom - ratio * pheight - height / 2 + value;
                }
            } else {
                y = ptop + pheight / 2;
            }
            // padding = [1, 1, 1,1]
            position = [x, y];
        }

        // startX, startY
        let [startX, startY] = position; // start point, [left, top]
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
