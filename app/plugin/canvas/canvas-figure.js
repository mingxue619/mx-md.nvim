// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

import { Label } from "./figure-label.js";
import { Rect } from "./figure-rect.js";
import { Cylinder } from "./figure-cylinder.js";
export const Figure = (canvas) => {
    const ctx = canvas.getContext('2d');
    return {
        label: function (params) {
            const label = new Label(ctx);
            label.draw(params);
        },
        rect: function (params) {
            const rect = new Rect(ctx);
            let figure = rect.draw(params);
            // label
            let label = params.label;
            if (label) {
                const align = label.align || {};
                align.frame = figure.frame;
                label.align = align;
                this.label(label);
            }
            return figure;
        },
        cylinder: function ({ position, size, color, label, children }) {

        },
    };
};
