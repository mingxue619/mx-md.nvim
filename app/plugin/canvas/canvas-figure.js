// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

import { Label } from "./figure-label.js";
import { Rect } from "./figure-rect.js";
import { Cylinder } from "./figure-cylinder.js";
import { Line } from "./figure-line.js";

export class Figure {
    constructor(canvas) {
        const ctx = canvas.getContext("2d");
        this.ctx = ctx;
    }
    label(params) {
        const label = new Label(this.ctx);
        label.draw(params);
    }

    drawLabelWithFrame(label, frame) {
        if (label) {
            if(typeof label === "string") {
                label = {
                    title: label
                }
            }
            const align = label.align || {};
            align.frame = frame;
            label.align = align;
            this.label(label);
        }
    }

    rect(params) {
        const rect = new Rect(this.ctx);
        let figure = rect.draw(params);
        // label
        this.drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }

    cylinder(params) {
        const cylinder = new Cylinder(this.ctx);
        let figure = cylinder.draw(params);
        // label
        this.drawLabelWithFrame(params.label, figure.frame);
    }
    line(params) {
        const line = new Line(this.ctx);
        let figure = line.draw(params);
        return figure;
    }
}
