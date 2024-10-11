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
// type = [label, line, rect, triangle, cylinder, circle, ellipse]
export class Paint {
    constructor(canvas) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        this.ctx = ctx;
    }

    static paintings = [];

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
            // paintings
            const paintings = Paint.paintings.filter((painting) => {
                const id = painting.id;
                const element = document.getElementById(id);
                if (element) {
                    return true;
                }
                return false;
            });
            paintings.push(painting);
            Paint.paintings = paintings;

            callback(painting, paintings);
        });
    }
    static resetAllImageData() {
        Paint.paintings.forEach((painting) => {
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
    // figure
    label(params) {
        const label = new Label(this.ctx);
        label.draw(params);
    }

    line(params) {
        const line = new Line(this.ctx);
        let figure = line.draw(params);
        // label
        new Label(this.ctx).drawLabelWithLine(params.label, figure);
        return figure;
    }

    rect(params) {
        const rect = new Rect(this.ctx);
        let figure = rect.draw(params);
        // label
        new Label(this.ctx).drawLabelWithFrame(params.label, figure.frame);
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
        new Label(this.ctx).drawLabelWithFrame(label, frame);

        return figure;
    }

    cylinder(params) {
        const cylinder = new Cylinder(this.ctx);
        let figure = cylinder.draw(params);
        // label
        new Label(this.ctx).drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }

    circle(params) {
        const circle = new Circle(this.ctx);
        let figure = circle.draw(params);
        // label
        new Label(this.ctx).drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }

    ellipse(params) {
        const ellipse = new Ellipse(this.ctx);
        let figure = ellipse.draw(params);
        // label
        new Label(this.ctx).drawLabelWithFrame(params.label, figure.frame);
        return figure;
    }
}
