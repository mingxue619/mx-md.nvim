export class Theme {
    constructor() {
        this.theme = "dark";
    }
    init(config) {
        this.config = config;

        let theme = this.theme;
        if (config === "dynamic") {
            theme = this.getDarkReaderConfig();
        } else if (action === "light" || action === "dark") {
            theme = action;
        } else {
        }
        this.theme = theme;
        this.initStyle(theme);
    }
    initStyle(theme) {
        if (theme === "light") {
        } else if (theme === "dark") {
            this.setDarkTheme();
        }
    }

    getDarkReaderConfig() {
        // <html lang="en" data-darkreader-mode="dynamic" data-darkreader-scheme="dark">
        const darkreaderMode = document.documentElement.dataset.darkreaderMode;
        const darkreaderScheme = document.documentElement.dataset.darkreaderScheme;
        return darkreaderScheme || "light";
    }
    setLightTheme() {
        this.background = null;
        this.foreground = null;

    }
    setDarkTheme() {
        // this.background = "#333";
        this.background = "black";
        // this.foreground = "#eee";
        this.foreground = "white";
    }
}
