import { Axes } from "/app/plugin/canvas/canvas-axes.js";
import { Theme } from "/app/plugin/canvas/canvas-theme.js";
import { CanvasScroll } from "/app/plugin/canvas/canvas-scroll.js";
import { Paint } from "/app/plugin/canvas/canvas-paint.js";

export class CanvasManager {
    static recursionDrawFlag = false;
    static paintings = [];
    static init(bufferInfo) {
        // cacel draw all, memory leaks may occur
        CanvasManager.paintings.forEach((painting) => {
            painting.draw = false;
        });
        CanvasManager._initPaintingList();
        CanvasManager.drawAll();
        CanvasManager.paintings.forEach((painting) => {
            CanvasManager._addMouseMoveListener(painting);
        });
        let scrollToCanvas = CanvasScroll.onBufferMove(bufferInfo);
        // CanvasManager._addMouseMoveListener();
        // document.addEventListener("PaintingInitEvent", (event) => {
        //     let painting = event.detail;
        //     CanvasManager.paintings.push(painting);
        //     CanvasManager.afterPaintingInit(painting, render);
        //     CanvasManager.addMouseMoveListener(painting);
        // });
        window.addEventListener("beforeprint", () => {
            CanvasManager.resetThemeAndDrawAll("clear");
        });

        window.addEventListener("afterprint", () => {
            CanvasManager.resetThemeAndDrawAll("init");
        });
    }
    static drawAll() {
        CanvasManager.paintings.forEach((painting) => {
            CanvasManager._draw(painting);
        });
    }
    static _initPaintingList() {
        const elements = document.getElementsByClassName("canvas");
        const elementArray = Array.from(elements);
        const paintings = elementArray.map((element) => {
            // const id = element.id;
            const elementVariableName = element.dataset.element;
            const paintVariableName = element.dataset.paint;
            const themeConfig = element.dataset.theme;
            let focusConfig = element.dataset.focus;
            focusConfig = focusConfig.toLowerCase() === "true";
            let axesConfig = element.dataset.axes;
            axesConfig = axesConfig.toLowerCase() === "true";
            let codeMap = element.dataset.codeMap;
            codeMap = codeMap.split(',').map(Number);
            let lineMap = element.dataset.lineMap;
            lineMap = decodeURIComponent(lineMap);
            lineMap = JSON.parse(lineMap);
            let code = element.dataset.code;
            code = decodeURIComponent(code);
            const paint = new Paint(element);
            const func = new Function(elementVariableName, paintVariableName, code);
            const shapes = func(element, paint);
            const config = {
                theme: themeConfig,
                axes: axesConfig,
                focus: focusConfig,
            };
            const theme = new Theme();
            theme.init(themeConfig);
            const painting = {
                config,
                element,
                paint,
                shapes,
                theme,
                codeMap,
                lineMap,
            };
            if (axesConfig) {
                painting.axes = new Axes(element);
            }
            return painting;
        });
        CanvasManager.paintings = paintings;
    }
    static resetThemeAndDrawAll(action) {
        const paintings = CanvasManager.paintings;
        if (action === "init") {
            paintings.forEach((painting) => {
                const { element, theme, config } = painting;
                theme.init(config.theme);
                if (config.axes) {
                    painting.axes = new Axes(element);
                }
            });
        } else if (action === "clear") {
            CanvasManager.resetFocus();
            paintings.forEach((painting) => {
                const { theme, config } = painting;
                theme.init("light");
                painting.axes = null;
            });
        }
        CanvasManager.drawAll();
    }
    static dispatchPaintingInitEvent(painting) {
        const paintingFinishEvent = new CustomEvent("PaintingInitEvent", {
            detail: painting,
        });
        document.dispatchEvent(paintingFinishEvent);
    }
    // static afterPaintingInit(painting, render) {
    //     const { element, config } = painting;
    //     if (config.axes) {
    //         painting.axes = new Axes(element);
    //     }
    //     //theme
    //     const theme = new Theme();
    //     theme.init(config.theme);
    //     painting.theme = theme;
    //     // init draw and scroll
    //     const bufferInfo = render.bufferInfo;
    //     let scrollToCanvas = CanvasScroll.onPaintingInit(painting, bufferInfo);
    // }

    static clearCanvas(paint) {
        const element = paint.element;
        const ctx = paint.ctx;
        ctx.clearRect(0, 0, element.width, element.height);
    }
    static _draw(painting) {
        painting.draw = true;
        requestAnimationFrame(() => {
            CanvasManager.recursionDraw(painting);
        });
    }
    static recursionDraw(painting) {
        if (!painting.draw) {
            return;
        }
        const { id, element, paint, axes, theme, shapes, focusShape } = painting;
        CanvasManager.clearCanvas(paint);
        if (axes) {
            axes.draw();
        }
        Object.values(shapes).forEach((shape) => {
            CanvasManager.drawShape(shape, theme);
        });
        if (focusShape) {
            CanvasManager.drawShape(focusShape, theme);
        }
        if (CanvasManager.recursionDrawFlag === true) {
            requestAnimationFrame(() => {
                CanvasManager.recursionDraw(painting);
            });
        }
    }
    static drawShape(shape, theme) {
        const { brush, labels, children } = shape;
        if (brush) {
            brush.draw(theme);
        } else {
        }
        if (labels) {
            labels.forEach((labelShape) => {
                CanvasManager.drawShape(labelShape, theme);
            });
        }

        if (children) {
            Object.values(children).forEach((childShape) => {
                CanvasManager.drawShape(childShape, theme);
            });
        }
    }
    static _addMouseMoveListener() {
        CanvasManager.paintings.forEach((painting) => {
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
        });
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
