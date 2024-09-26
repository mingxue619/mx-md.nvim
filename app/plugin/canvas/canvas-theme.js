class Theme {
    constructor(canvas) {
        this.canvas = canvas;
    }

    setTheme(theme) {
        if (theme === "dark") {
            this.setDarkTheme();
        } else if (theme === "light") {
        } else {
            // <html lang="en" data-darkreader-mode="dynamic" data-darkreader-scheme="dark">
            const html = document.documentElement;
            const darkreaderMode = html.dataset.darkreaderMode;
            const darkreaderScheme = html.dataset.darkreaderScheme;
            if (darkreaderScheme === "dark") {
                this.setDarkTheme();
            }
        }
    }
    setDarkTheme() {
        const canvas = this.canvas;
        const ctx = canvas.getContext("2d");
        // ctx.fillStyle = "#333";
        ctx.fillStyle = "black";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.strokeStyle = "#eee";
        ctx.strokeStyle = "white";
    }
}
