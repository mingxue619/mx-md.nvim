document.addEventListener("DOMContentLoaded", function () {
    debugger;
    const theme = "default";
    const ganttAxisFormat = "%Y-%m-%d";
    mermaid.initialize({
        theme: theme,
        gantt: {
            axisFormatter: [
                [
                    ganttAxisFormat,
                    (d) => {
                        return d.getDay() === 1;
                    },
                ],
            ],
        },
    });
});
