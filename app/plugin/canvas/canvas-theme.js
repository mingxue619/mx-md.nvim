class Theme {
    constructor(canvas) {
        this.canvas = canvas;
    }

    setTheme(theme) {
        debugger;
        if (theme === "dynamic") {
            // <html lang="en" data-darkreader-mode="dynamic" data-darkreader-scheme="dark">
            const html = document.documentElement;
            const darkreaderMode = html.dataset.darkreaderMode;
            const darkreaderScheme = html.dataset.darkreaderScheme;
            if (darkreaderScheme === "dark") {
                window.theme = darkreaderScheme;
            } else {
                window.theme = "light";
            }
        } else {
            window.theme = theme;
        }
        if (window.theme === "dark") {
            this.setDarkTheme();
        } else if (window.theme === "beforeprint") {
            this.clearCanvas();
        } else if (window.theme === "afterprint") {
            this.setDarkTheme();
        }
    }
    setDarkTheme() {
        // window.background = "#333";
        window.background = "black";
        // window.foreground = "#eee";
        window.foreground = "white";
        const canvas = this.canvas;
        const ctx = canvas.getContext("2d");
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
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}
