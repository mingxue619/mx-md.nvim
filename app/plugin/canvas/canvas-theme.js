class Theme {
    constructor(canvas) {
        this.canvas = canvas;
    }

    setTheme(theme) {
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
            // window.background = "#333";
            window.background = "black";
            // window.foreground = "#eee";
            window.foreground = "white";
            this.setDarkTheme();
        }
    }
    setDarkTheme() {
        const canvas = this.canvas;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = window.background;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = window.foreground;
    }
}
