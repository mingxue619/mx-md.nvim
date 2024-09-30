// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

import { Label } from "./figure-label.js";
import { Line } from "./figure-line.js";
import { Rect } from "./figure-rect.js";
import { Cylinder } from "./figure-cylinder.js";
import { Triangle } from "./figure-triangle.js";
import { Circle } from "./figure-circle.js";
import { Ellipse } from "./figure-ellipse.js";

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
            if (typeof label === "string") {
                label = {
                    title: label,
                };
            }
            const align = label.align || {};
            align.frame = frame;
            label.align = align;
            this.label(label);
        }
    }

    line(params) {
        const line = new Line(this.ctx);
        let figure = line.draw(params);
        return figure;
    }

    rect(params) {
        const rect = new Rect(this.ctx);
        let figure = rect.draw(params);
        // label
        this.drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }

    triangle(params) {
        const triangle = new Triangle(this.ctx);
        let figure = triangle.draw(params);
        let frame = figure.frame;
        const height = frame.bottom - frame.top; 
        // label
        let label = params.label;
        if (typeof label === "string") {
            label = {
                title: label,
                align: {
                    v: "top",
                    margin: {
                        top: height/2
                    }
                },
            };
        }
        this.drawLabelWithFrame(label, frame);

        return figure;
    }

    cylinder(params) {
        const cylinder = new Cylinder(this.ctx);
        let figure = cylinder.draw(params);
        // label
        this.drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }

    circle(params) {
        const circle = new Circle(this.ctx);
        let figure = circle.draw(params);
        // label
        this.drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }

    ellipse(params) {
        const ellipse = new Ellipse(this.ctx);
        let figure = ellipse.draw(params);
        // label
        this.drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }
}
