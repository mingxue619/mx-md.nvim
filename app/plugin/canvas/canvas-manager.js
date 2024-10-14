import { Axes } from "/app/plugin/canvas/canvas-axes.js";
import { CanvasScroll } from "/app/scroll-canvas.js";

export class CanvasManager {
    static recursionDrawFlag = false;
    static paintings = [];
    static dispatchPaintingFinishEvent(painting) {
        const paintingFinishEvent = new CustomEvent("PaintingFinishEvent", {
            detail: painting,
        });
        document.dispatchEvent(paintingFinishEvent);
    }

    static onPaintingDrawFinish(callback) {
        document.addEventListener("PaintingFinishEvent", (event) => {
            let painting = event.detail;
            CanvasManager.paintings.push(painting);
            CanvasManager.cancelDraw();
            CanvasManager.unFocus();
            CanvasManager.draw(painting);
            CanvasManager.addMouseMoveListener(painting);
            callback(painting);
        });
    }
    static clearCanvas(paint) {
        const element = paint.element;
        const ctx = paint.ctx;
        ctx.clearRect(0, 0, element.width, element.height);
    }
    static draw(painting) {
        painting.draw = true;
        requestAnimationFrame(() => {
            CanvasManager.recursionDraw(painting);
        });
    }
    static recursionDraw(painting) {
        if (!painting.draw) {
            return;
        }
        const { id, element, paint, axes, shapes, focusShape } = painting;
        CanvasManager.clearCanvas(paint);
        if (axes) {
            new Axes(element).draw();
        }
        Object.values(shapes).forEach((shape) => {
            CanvasManager.drawShape(shape);
        });
        if (focusShape) {
            CanvasManager.drawShape(focusShape);
        }
        if (CanvasManager.recursionDrawFlag) {
            requestAnimationFrame(() => {
                CanvasManager.recursionDraw(painting);
            });
        }
    }
    static drawShape(shape) {
        const { brush, labels, children } = shape;
        if(brush) {
            brush.draw();
        } else {
            debugger
        }
        if (labels) {
            labels.forEach((labelShape) => {
                CanvasManager.drawShape(labelShape);
            });
        }

        if (children) {
            Object.values(children).forEach((childShape) => {
                CanvasManager.drawShape(childShape);
            });
        }
    }
    static cancelDraw() {
        // paintings
        const paintings = CanvasManager.paintings.filter((painting) => {
            const id = painting.id;
            const element = document.getElementById(id);
            if (element) {
                return true;
            }
            painting.draw = false;
            return false;
        });
        CanvasManager.paintings = paintings;
    }
    // static resetAllImageData() {
    //     Paint.paintings.forEach((painting) => {
    //         const paint = painting.paint;
    //         // const canvas = paint.getCanvas();
    //         const ctx = paint.getContext();
    //         const imageData = painting.imageData;
    //         ctx.putImageData(imageData, 0, 0);
    //     });
    // }

    static addMouseMoveListener(painting) {
        const element = painting.element;
        const debouncedHandler = CanvasManager.debounce(100, function (event) {
            // 获取鼠标位置
            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const mouse = [x, y];
            CanvasScroll.onMouseMove(painting, mouse);
        });
        element.addEventListener("mousemove", debouncedHandler);
    }
    // 防抖函数
    static debounce(wait, func) {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    static unFocus() {
        CanvasManager.paintings.forEach((paintding) => {
            paintding.focusTarget = null;
            paintding.focusShape = null;
        });
    }
    static isFocus(painting, shape) {
        const matchs = CanvasManager.paintings.filter((item) => {
            if (item != painting) {
                return false;
            }
            if (item.focusTarget != shape) {
                return false;
            }
            return true;
        });
        if (matchs.length <= 0) {
            return false;
        }
        return true;
    }
    static setFocus(painting, focusTarget, focusShape) {
        painting.focusTarget = focusTarget;
        painting.focusShape = focusShape;
    }
}
