export class Theme {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    setTheme(config) {
        if (config === "dynamic") {
            window.theme = this.getDarkReaderConfig();
        } else if (config === "light" || config === "dark") {
            window.theme = config;
        } else {
        }
        if (window.theme === "dark") {
            if (config === "beforeprint") {
                this.clearCanvas();
            } else if (config === "afterprint") {
                this.setDarkTheme();
            } else {
                this.setDarkTheme();
            }
        }
    }
    getDarkReaderConfig() {
        // <html lang="en" data-darkreader-mode="dynamic" data-darkreader-scheme="dark">
        const darkreaderMode = document.documentElement.dataset.darkreaderMode;
        const darkreaderScheme = document.documentElement.dataset.darkreaderScheme;
        return darkreaderScheme || "light";
    }
    setDarkTheme() {
        // window.background = "#333";
        window.background = "black";
        // window.foreground = "#eee";
        window.foreground = "white";
        const canvas = this.canvas;
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = window.background;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = window.foreground;
    }
    clearCanvas() {
        window.background = undefined;
        window.foreground = undefined;
        const canvas = this.canvas;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}
