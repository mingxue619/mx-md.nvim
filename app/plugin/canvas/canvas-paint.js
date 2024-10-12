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

    static dispatchPaintingFinishEvent(painting) {
        const paintingFinishEvent = new CustomEvent("PaintingFinishEvent", {
            detail: painting,
        });
        document.dispatchEvent(paintingFinishEvent);
    }
    static onPaintingDrawFinish(callback) {
        // document.addEventListener("PaintingFinishEvent", (event) => {
        //     let painting = event.detail;
        //     // image data
        //     const paint = painting.paint;
        //     const canvas = paint.getCanvas();
        //     const ctx = paint.getContext();
        //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //     painting.imageData = imageData;
        //     // paintings
        //     const paintings = Paint.paintings.filter((painting) => {
        //         const id = painting.id;
        //         const element = document.getElementById(id);
        //         if (element) {
        //             return true;
        //         }
        //         return false;
        //     });
        //     paintings.push(painting);
        //     Paint.paintings = paintings;
        //
        //     callback(painting, paintings);
        // });
        document.addEventListener("PaintingFinishEvent", (event) => {
            let painting = event.detail;
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
    // shape
    label(params) {
        debugger
        // const label = new Label(this.ctx);
        // label.draw(params);
        let shape = Label.build(this.ctx).buildShape(params);
        shape.brush.draw();
    }

    line(params) {
        let shape = Line.build(this.ctx).buildShape(params);
        shape.brush.draw();
        // label
        const lableShapes = Label.build(this.ctx).buildShapesWithLine(params.label, shape);
        return shape;
    }

    rect(params) {
        let shape = Rect.build(this.ctx).buildShape(params);
        shape.brush.draw();
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        return shape;
    }

    triangle(params) {
        let shape = Triangle.build(this.ctx).buildShape(params);
        shape.brush.draw();

        let frame = shape.frame;
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
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);

        return shape;
    }

    cylinder(params) {
        const cylinder = new Cylinder(this.ctx);
        let shape = cylinder.draw(params);
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        return shape;
    }

    circle(params) {
        const circle = new Circle(this.ctx);
        let shape = circle.draw(params);
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        return shape;
    }

    ellipse(params) {
        const ellipse = new Ellipse(this.ctx);
        let shape = ellipse.draw(params);
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        return shape;
    }
}
