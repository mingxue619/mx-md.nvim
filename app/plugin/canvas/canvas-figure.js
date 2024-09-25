function Figure(ctx) {
    return {
        rect: function ({position, size, color}) {
            ctx.save();
            const [x, y] = position;
            const [width, height] = size;
            if(color) {
                ctx.fillStyle = color;
            }
            ctx.fillRect(x, y, width, height);
            ctx.restore();
        },
    };
}
