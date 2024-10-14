import { Axes } from "/app/plugin/canvas/canvas-axes.js";
import { Theme } from "/app/plugin/canvas/canvas-theme.js";
import { CanvasScroll } from "/app/plugin/canvas/canvas-scroll.js";

export class CanvasManager {
    static recursionDrawFlag = false;
    static paintings = [];
    static init(render) {
        document.addEventListener("PaintingInitEvent", (event) => {
            debugger;
            let painting = event.detail;
            CanvasManager.paintings.push(painting);
            CanvasManager.afterPaintingInit(painting, render);
            CanvasManager.addMouseMoveListener(painting);
        });
    }
    static dispatchPaintingInitEvent(painting) {
        const paintingFinishEvent = new CustomEvent("PaintingInitEvent", {
            detail: painting,
        });
        document.dispatchEvent(paintingFinishEvent);
    }
    static afterPaintingInit(painting, render) {
        debugger;
        const { element, config: {theme, axes} } = painting;
        if(axes) {
            painting.axes = new Axes(element);
        }
        //theme
        // painting.theme = new Theme(theme);
        // init draw and scroll
        const bufferInfo = render.bufferInfo;
        let scrollToCanvas = CanvasScroll.onPaintingInit(painting, bufferInfo);
        //todo print event
    }

    static clearCanvas(paint) {
        const element = paint.element;
        const ctx = paint.ctx;
        ctx.clearRect(0, 0, element.width, element.height);
    }
    static drawAll() {
        CanvasManager.cancelDraw();
        CanvasManager.paintings.forEach((painting) => {
            CanvasManager.draw(painting);
        });
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
            axes.draw();
        }
        Object.values(shapes).forEach((shape) => {
            CanvasManager.drawShape(shape);
        });
        if (focusShape) {
            CanvasManager.drawShape(focusShape);
        }
        if (CanvasManager.recursionDrawFlag === true) {
            requestAnimationFrame(() => {
                CanvasManager.recursionDraw(painting);
            });
        }
    }
    static drawShape(shape) {
        const { brush, labels, children } = shape;
        if (brush) {
            brush.draw();
        } else {
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
    static resetFocus() {
        CanvasManager.paintings.forEach((painting) => {
            painting.focusTarget = null;
            painting.focusShape = null;
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
    static setFocusShape(painting, focusTarget, focusShape) {
        painting.focusTarget = focusTarget;
        painting.focusShape = focusShape;
    }
}
