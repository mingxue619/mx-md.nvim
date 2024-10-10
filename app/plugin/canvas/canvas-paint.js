// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

import { Label } from "./paint-label.js";
import { Line } from "./paint-line.js";
import { Rect } from "./paint-rect.js";
import { Cylinder } from "./paint-cylinder.js";
import { Triangle } from "./paint-triangle.js";
import { Circle } from "./paint-circle.js";
import { Ellipse } from "./paint-ellipse.js";

export class Paint {
    constructor(canvas) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        this.ctx = ctx;
    }

    static paintingMap = new Map();

    static dispatchPaintFinishEvent(painting) {
        const paintFinishEvent = new CustomEvent("PaintFinishEvent", {
            detail: painting,
        });
        document.dispatchEvent(paintFinishEvent);
    }
    static onPaintFinish(callback) {
        document.addEventListener("PaintFinishEvent", (event) => {
            let painting = event.detail;
            // image data
            const paint = painting.paint;
            const canvas = paint.getCanvas();
            const ctx = paint.getContext();
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            painting.imageData = imageData;
            // paintingMap
            const paintingMap = Paint.paintingMap;
            const id = painting.id;
            paintingMap.set(id, painting);
            Paint.paintingMap = paintingMap;

            callback(painting, paintingMap);
        });
    }
    static resetAllImageData() {
        const paintingMap = Paint.paintingMap;
        Array.from(paintingMap.entries()).forEach(([id, painting]) => {
            const paint = painting.paint;
            // const canvas = paint.getCanvas();
            const ctx = paint.getContext();
            const imageData = painting.imageData;
            ctx.putImageData(imageData, 0, 0);
        });
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.ctx;
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
                        top: height / 2,
                    },
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
