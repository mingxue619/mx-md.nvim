class Theme {
    constructor(canvas) {
        this.canvas = canvas;
    }

    setTheme(theme) {
        debugger
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
