import { Axes } from "/app/plugin/canvas/canvas-axes.js";

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
            debugger;
            let painting = event.detail;
            CanvasManager.paintings.push(painting);
            CanvasManager.cancelDraw();
            CanvasManager.draw(painting);

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
            focusShape.draw();
        }
        if (CanvasManager.recursionDrawFlag) {
            requestAnimationFrame(() => {
                CanvasManager.recursionDraw(painting);
            });
        }
    }
    static drawShape(shape) {
        const { brush, labels, children } = shape;
        brush.draw();
        if (labels) {
            labels.forEach((labelShape) => {
                CanvasManager.drawShape(labelShape);
            });
        }

        if (children) {
            children.forEach((childShape) => {
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
}
