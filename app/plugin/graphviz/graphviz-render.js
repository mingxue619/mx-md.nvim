import { instance } from "/node_modules/@viz-js/viz/lib/viz-standalone.mjs";

export class GraphvizRender {
    static async init(bufferInfo) {
        const viz = await instance();
        const elements = document.getElementsByClassName("dot");
        const elementArray = Array.from(elements);
        elementArray.forEach((element) => {
            const svg = viz.renderSVGElement(element.textContent);
            element.textContent = "";
            element.appendChild(svg);
        });
    }
}
