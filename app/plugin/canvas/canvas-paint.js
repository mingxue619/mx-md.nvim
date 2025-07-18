// position: 图形中心点{三角形: 底边中心}
// frame: 画框，图形左右上下的范围
// from: 起点

// import { Axes } from "/app/plugin/canvas/canvas-axes.js";
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
    _buildLabelShapesWithFrame(label, labels, frame) {
        const lableShapes = [];
        if (!!label) {
            const lableShape = Label.build(this.ctx).buildShapeWithFrame(label, frame);
            if (!!lableShape) {
                lableShapes.push(lableShape);
            }
        }
        if (!!labels && Array.isArray(labels)) {
            labels.forEach((label) => {
                const lableShape = Label.build(this.ctx).buildShapeWithFrame(label, frame);
                if (!!lableShape) {
                    lableShapes.push(lableShape);
                }
            });
        }
        return lableShapes;
    }

    // shape
    label(params) {
        let shape = Label.build(this.ctx).buildShape(params);
        shape.brush.draw();
    }

    line(params) {
        let shape = Line.build(this.ctx).buildShape(params);
        // shape.brush.draw();
        //labels
        const {label, labels} = params;
        const lableShapes = this._buildLabelShapesWithFrame(label, labels, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }

    rect(params) {
        let shape = Rect.build(this.ctx).buildShape(params);
        //labels
        const {label, labels} = params;
        const lableShapes = this._buildLabelShapesWithFrame(label, labels, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }

    triangle(params) {
        let shape = Triangle.build(this.ctx).buildShape(params);
        // shape.brush.draw();
        let frame = shape.frame;
        const height = frame.bottom - frame.top;
        // label
        const {label, labels} = params;
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
        //labels
        const lableShapes = this._buildLabelShapesWithFrame(label, labels, shape.frame);
        shape.labels = lableShapes;

        return shape;
    }

    cylinder(params) {
        let shape = Cylinder.build(this.ctx).buildShape(params);
        //labels
        const {label, labels} = params;
        const lableShapes = this._buildLabelShapesWithFrame(label, labels, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }

    circle(params) {
        let shape = Circle.build(this.ctx).buildShape(params);
        //labels
        const {label, labels} = params;
        const lableShapes = this._buildLabelShapesWithFrame(label, labels, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }

    ellipse(params) {
        let shape = Ellipse.build(this.ctx).buildShape(params);
        //labels
        const {label, labels} = params;
        const lableShapes = this._buildLabelShapesWithFrame(label, labels, shape.frame);
        shape.labels = lableShapes;
        return shape;
    }
}
