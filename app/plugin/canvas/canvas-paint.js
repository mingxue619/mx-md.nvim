// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

import { Axes } from "/app/plugin/canvas/canvas-axes.js";
import { Label } from "./paint-label.js";
import { Line } from "./paint-line.js";
import { Rect } from "./paint-rect.js";
import { Cylinder } from "./paint-cylinder.js";
import { Triangle } from "./paint-triangle.js";
import { Circle } from "./paint-circle.js";
import { Ellipse } from "./paint-ellipse.js";
// type = [label, line, rect, triangle, cylinder, circle, ellipse]
export class Paint {
    constructor(element) {
        this.element = element;
        const ctx = element.getContext("2d", { willReadFrequently: true });
        this.ctx = ctx;
    }

    // shape
    label(params) {
        let shape = Label.build(this.ctx).buildShape(params);
        shape.brush.draw();
    }

    line(params) {
        let shape = Line.build(this.ctx).buildShape(params);
        // shape.brush.draw();
        // label
        const lableShapes = Label.build(this.ctx).buildShapesWithLine(params.label, shape);
        shape.labels = lableShapes;
        return shape;
    }

    rect(params) {
        let shape = Rect.build(this.ctx).buildShape(params);
        // shape.brush.draw();
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }

    triangle(params) {
        let shape = Triangle.build(this.ctx).buildShape(params);
        // shape.brush.draw();
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
        shape.labels = lableShapes;

        return shape;
    }

    cylinder(params) {
        let shape = Cylinder.build(this.ctx).buildShape(params);
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }

    circle(params) {
        const circle = new Circle(this.ctx);
        let shape = circle.draw(params);
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }

    ellipse(params) {
        const ellipse = new Ellipse(this.ctx);
        let shape = ellipse.draw(params);
        // label
        const lableShapes = Label.build(this.ctx).buildShapeWithFrame(params.label, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }
}
