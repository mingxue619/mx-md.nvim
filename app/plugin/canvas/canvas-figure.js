// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

import { Rect } from "./canvas-rect.js";
import { Label } from "./canvas-label.js";
export const Figure = (ctx) => {
    return {
        rect: function (params) {
            const rect = new Rect(ctx);
            let figure = rect.draw(params);
            // label
            let label = params.label;
            if (label) {
                const align = label.align || {};
                align.frame = figure.frame;
                label.align = align;
                const labelFigure = new Label(ctx);
                labelFigure.draw(label);
            }
            return figure;
        },
        cylinder: function ({ position, size, color, label, children }) {},
        label: function ({ title, font, color, align, position }) {},
    };
};
