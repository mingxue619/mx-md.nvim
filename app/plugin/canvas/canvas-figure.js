// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

import { Label } from "./figure-label.js";
import { Rect } from "./figure-rect.js";
import { Cylinder } from "./figure-cylinder.js";
export class Figure {
    constructor(canvas) {
        const ctx = canvas.getContext("2d");
        this.ctx = ctx;
    }
    label(params) {
        const label = new Label(this.ctx);
        label.draw(params);
    }

    rect(params) {
        const rect = new Rect(this.ctx);
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
    }
    cylinder({ position, size, color, label, children }) {
        const cylinder = new Cylinder(this.ctx);
        var radius = 50; // 半径
        var height = 100; // 高度
        var color = "#3399ff"; // 颜色

        // 调用函数绘制圆柱
        drawCylinder(ctx, centerX, centerY, radius, height, color);

        cylinder.draw();
    }
}
