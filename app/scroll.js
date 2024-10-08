class CursorScroll {
    reScroll() {
        const render = window.render;
        const bufferInfo = render.bufferInfo;
        this.scrollTo(bufferInfo);
    }
    focusToCanvas(bufferInfo) {
        const canvasMap = window.canvas;
        if (!canvasMap) {
            return false;
        }
        const cursor = bufferInfo.cursor;
        const line = cursor[1] - 1;
        let cursorAtCanvas = false;
        const values = Array.from(canvasMap.entries())
            .filter(([key, value]) => {
                let [start, end] = value.map;
                if (start <= line && line < end) {
                    return true;
                }
                return false;
            })
            .map(([key, value]) => value);
        if (values.length <= 0) {
            return false;
        }
        const info = values[0];
        let [start, end] = info.map;
        const lineMap = info.lineMap;
        const entries = Object.entries(lineMap).map(([key, value]) => [start + parseInt(key), value]);

        const matchs = entries.filter(([key, value]) => line <= key);
        const [key, name] = matchs.at(0) || entries.at(-1);

        debugger;
        if (cursorAtCanvas === false) {
            return false;
        }
        return true;
    }
    scrollTo(bufferInfo) {
        let toCanvas = this.focusToCanvas(bufferInfo);
        if (toCanvas) {
            return;
        }
        const cursor = bufferInfo.cursor;
        const winline = bufferInfo.winline;
        const winheight = bufferInfo.winheight;
        this.lines = bufferInfo.lines || this.lines;
        const len = this.lines.length;
        const ratio = winline / winheight;
        const line = cursor[1] - 1;
        if (line === 0 || line === len - 1) {
            this.topOrBottom(line, len);
        } else {
            this.relativeScroll(line, ratio, len);
        }
    }
    topOrBottom(line, len) {
        if (line === 0) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        } else if (line === len - 1) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }
    }
    relativeScroll(line, ratio, len) {
        let offsetTop = 0;
        const lineElement = document.querySelector(`[data-source-line="${line}"]`);
        if (lineElement) {
            offsetTop = lineElement.offsetTop;
        } else {
            const pre = this.getPreLineOffsetTop(line);
            const next = this.getNextLineOffsetTop(line, len);
            offsetTop = pre[1] + ((next[1] - pre[1]) * (line - pre[0])) / (next[0] - pre[0]);
        }
        let scrollTop = offsetTop - document.documentElement.clientHeight * ratio;
        window.scrollTo({
            top: scrollTop,
            left: 0,
            behavior: "smooth",
        });
    }
    getPreLineOffsetTop(line) {
        let currentLine = line - 1;
        let ele = null;
        while (currentLine > 0 && !ele) {
            ele = document.querySelector(`[data-source-line="${currentLine}"]`);
            if (!ele) {
                currentLine -= 1;
            }
        }
        return [currentLine >= 0 ? currentLine : 0, ele ? ele.offsetTop : 0];
    }

    getNextLineOffsetTop(line, len) {
        let currentLine = line + 1;
        let ele = null;
        while (currentLine < len && !ele) {
            ele = document.querySelector(`[data-source-line="${currentLine}"]`);
            if (!ele) {
                currentLine += 1;
            }
        }
        return [currentLine < len ? currentLine : len - 1, ele ? ele.offsetTop : document.documentElement.scrollHeight];
    }
}
