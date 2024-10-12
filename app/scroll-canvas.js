import { CanvasManager } from "/app/plugin/canvas/canvas-manager.js";

export class CurrentFocusCanvas {
    static element;
    static shape;
    static unFocus() {
        CurrentFocusCanvas.element = null;
        CurrentFocusCanvas.shape = null;
    }
    static focus(element, shape) {
        CurrentFocusCanvas.element = element;
        CurrentFocusCanvas.shape = shape;
    }
    static isFocus(element, shape) {
        if (CurrentFocusCanvas.element != element) {
            return false;
        }
        if (CurrentFocusCanvas.shape != shape) {
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
        const paintings = CanvasManager.paintings.filter((painting) => {
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
        const [key, variableName] = matchLines.at(0) || lineMap.at(-1);
        const element = painting.element;
        const paint = painting.paint;
        const shape = painting.shapes[variableName];
        // const ctx = paint.getContext();
        const isFocus = CurrentFocusCanvas.isFocus(element, shape);
        if (isFocus) {
            return true;
        }
        // Paint.resetAllImageData();
        CanvasScroll.drawFocusshape(paint, shape);
        CanvasScroll.focusToshape(element, shape);
        CurrentFocusCanvas.focus(element, shape);
        return true;
    }
    static drawFocusshape(paint, shape) {
        const { type, position, outline } = shape;
        if (type === "label") {
        } else if (type === "line") {
            const brush = shape.brush;
            const params = brush.params;
            // const { from, to, style, arrow, polyline } = params;
            const lineParams = {
                ...params,
                style: {
                    strokeStyle: "red",
                    lineWidth: 3,
                },
            };
            paint.line(lineParams);
        } else {
            const width = Math.abs(outline.right - outline.left) + 20;
            const height = Math.abs(outline.bottom - outline.top) + 20;
            const style = {
                strokeStyle: "red",
                lineWidth: 2,
                lineDash: [5, 5],
            };
            const params = {
                position: position,
                size: [width, height],
                style,
            };
            paint.rect(params);
        }
    }
    static focusToshape(element, shape) {
        const rect = element.getBoundingClientRect();
        const { left, right, top, bottom, x, y } = rect;
        const { position, outline } = shape;

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
        const { unFocus, reset, draw, element, paint, shape } = CanvasScroll.mouseMoveNeedDraw(painting, mouse);
        if (unFocus) {
            CurrentFocusCanvas.unFocus();
        }
        if (reset) {
            // Paint.resetAllImageData();
        }
        if (draw) {
            CanvasScroll.drawFocusshape(paint, shape);
            CurrentFocusCanvas.focus(element, shape);
        }
    }
    static mouseMoveNeedDraw(painting, mouse) {
        let { element, paint, shapes } = painting;
        const [x, y] = mouse;
        const shapeArray = Object.values(shapes).filter((shape) => {
            const { type, outline, trackPoints } = shape;
            if (type === "lable") {
                return;
            } else if (type === "line") {
                const distinct = LineUtil.pointToPolylineDistance(mouse, trackPoints);
                if (distinct > 10) {
                    return false;
                }
            } else {
                const { left, top, right, bottom } = outline;
                if (left <= x && x <= right) {
                } else {
                    return false;
                }
                if (top <= y && y <= bottom) {
                } else {
                    return false;
                }
            }
            return true;
        });
        if (shapeArray.length <= 0) {
            return {
                reset: true,
                unFocus: true,
            };
        }
        const shape = shapeArray[0];
        const isFocus = CurrentFocusCanvas.isFocus(element, shape);
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
            shape,
        };
    }
}
class LineUtil {
    static pointToLineDistance(point, from, to) {
        const [px, py] = point;
        const [x1, y1] = from;
        const [x2, y2] = to;

        const A = x2 - x1;
        const B = y2 - y1;
        const C = (x1 - px) * A + (y1 - py) * B;
        const lenSq = A * A + B * B;
        let param, xx, yy;

        if (lenSq === 0) {
            // 线段退化为一个点
            param = 0.0;
        } else {
            param = (-1.0 * C) / lenSq;
        }

        if (param < 0.0) {
            xx = x1;
            yy = y1;
        } else if (param > 1.0) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * A;
            yy = y1 + param * B;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static pointToPolylineDistance(point, trackPoints) {
        let minDistance = Infinity;
        const numPoints = trackPoints.length;

        for (let i = 0; i < numPoints - 1; i++) {
            const distance = LineUtil.pointToLineDistance(
                point,
                [trackPoints[i][0], trackPoints[i][1]],
                [trackPoints[i + 1][0], trackPoints[i + 1][1]],
            );
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        // 如果折线是闭合的，还需要检查最后一个点到第一个点的线段
        // 注意：如果折线不是闭合的，则下面的检查应该被省略
        if (trackPoints[0].x !== trackPoints[numPoints - 1].x || trackPoints[0].y !== trackPoints[numPoints - 1].y) {
            const distance = pointToSegmentDistance(
                mouse.x,
                mouse.y,
                trackPoints[numPoints - 1].x,
                trackPoints[numPoints - 1].y,
                trackPoints[0].x,
                trackPoints[0].y,
            );
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        return minDistance;
    }
}
