import { Paint } from "/app/plugin/canvas/canvas-paint.js";

export class CurrentFocusCanvas {
    static element;
    static figure;
    static unFocus() {
        CurrentFocusCanvas.element = null;
        CurrentFocusCanvas.figure = null;
    }
    static focus(element, figure) {
        CurrentFocusCanvas.element = element;
        CurrentFocusCanvas.figure = figure;
    }
    static isFocus(element, figure) {
        if (CurrentFocusCanvas.element != element) {
            return false;
        }
        if (CurrentFocusCanvas.figure != figure) {
            return false;
        }
        return true;
    }
}

export class CanvasScroll {
    // canvas
    static scrollToCanvas(bufferInfo) {
        const cursor = bufferInfo.cursor;
        const line = cursor[1] - 1;
        const paintings = Paint.paintings.filter((painting) => {
            let [start, end] = painting.map;
            if (start <= line && line < end) {
                return true;
            }
            return false;
        });
        if (paintings.length <= 0) {
            return false;
        }
        const painting = paintings[0];
        let [start, end] = painting.map;
        let lineMap = painting.lineMap;
        // 相对行号转为绝对行号
        lineMap = Object.entries(lineMap).map(([key, value]) => [start + parseInt(key), value]);
        const matchLines = lineMap.filter(([key, value]) => line <= key);
        const [key, variableName] = matchLines.at(0) || entries.at(-1);
        const element = painting.element;
        const paint = painting.paint;
        const figure = painting.figures[variableName];
        // const ctx = paint.getContext();
        const isFocus = CurrentFocusCanvas.isFocus(element, figure);
        if (isFocus) {
            return true;
        }
        Paint.resetAllImageData();
        CanvasScroll.drawFocusFigure(paint, figure);
        CanvasScroll.focusToFigure(element, figure);
        CurrentFocusCanvas.focus(element, figure);
        return true;
    }
    static drawFocusFigure(paint, figure) {
        const { type, position, outline } = figure;
        const style = {
            strokeStyle: "red",
            lineWidth: 2,
            lineDash: [5, 5],
        };
        if (type === "label") {
        } else if (type === "line") {
        } else if (type === "rect") {
            const width = Math.abs(outline.right - outline.left) + 20;
            const height = Math.abs(outline.bottom - outline.top) + 20;
            const params = {
                position: position,
                size: [width, height],
                style,
            };
            paint.rect(params);
        } else if (type === "triangle") {
            const width = Math.abs(outline.right - outline.left) + 20;
            const height = Math.abs(outline.bottom - outline.top) + 20;
            const params = {
                position: position,
                size: [width, height],
                style,
            };
            paint.rect(params);
        } else if (type === "cylinder") {
            const width = Math.abs(outline.right - outline.left) + 20;
            const height = Math.abs(outline.bottom - outline.top) + 20;
            const params = {
                position: position,
                size: [width, height],
                style,
            };
            paint.rect(params);
        } else if (type === "circle") {
        } else if (type === "ellipse") {
        }
    }
    static focusToFigure(element, figure) {
        const rect = element.getBoundingClientRect();
        const { left, right, top, bottom, x, y } = rect;
        const { position, outline } = figure;

        // const width = window.innerWidth;
        // const height = window.innerHeight; // 窗口的内部高度（不包括滚动条）
        const docWidth = document.documentElement.clientWidth;
        const docHeight = document.documentElement.clientHeight; // 文档的客户端高度（包括滚动条）
        // const screenX = window.screenX;
        // const screenY = window.screenY; // 窗口上边缘相对于屏幕上边缘的距离
        const scrollX = window.scrollX;
        const scrollY = window.scrollY; //垂直滚动的距离
        // const pixelRatio = window.devicePixelRatio;

        // 默认target，让元素左上角对齐,只有当前元素超出屏幕时才让元素居中
        let targetLeft = scrollX + left;
        let targetTop = scrollY + top;
        if (outline.right > docWidth) {
            // 右边超出屏幕
            targetLeft = targetLeft + position[0] - docWidth / 2;
        }
        if (outline.bottom > docHeight) {
            // 底部超出屏幕
            targetTop = targetTop + position[1] - docHeight / 2;
        }
        window.scrollTo(targetLeft, targetTop);
    }
    static onMouseMove(painting, mouse) {
        const { reset, draw, element, paint, figure } = CanvasScroll.mouseMoveNeedDraw(painting, mouse);
        if (reset) {
            Paint.resetAllImageData();
        }
        if (draw) {
            CanvasScroll.drawFocusFigure(paint, figure);
            CurrentFocusCanvas.focus(element, figure);
        }
    }
    static mouseMoveNeedDraw(painting, mouse) {
        let { element, paint, figures } = painting;
        const [x, y] = mouse;
        const excludeType = ["lable", "line"];
        const figureArray = Object.values(figures).filter((figure) => {
            const { type, outline } = figure;
            if (excludeType.includes(type)) {
                return false;
            }
            const { left, top, right, bottom } = outline;
            if (left <= x && x <= right) {
            } else {
                return false;
            }
            if (top <= y && y <= bottom) {
            } else {
                return false;
            }
            return true;
        });
        if (figureArray.length <= 0) {
            return {
                reset: true,
            };
        }
        const figure = figureArray[0];
        const isFocus = CurrentFocusCanvas.isFocus(element, figure);
        if (isFocus) {
            return {
                reset: false,
            };
        }
        return {
            reset: true,
            draw: true,
            element,
            paint,
            figure,
        };
    }
}
