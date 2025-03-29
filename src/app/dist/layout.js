"use strict";
exports.__esModule = true;
exports.metadata = void 0;
require("./globals.css");
var google_1 = require("next/font/google");
var ThemeToggle_1 = require("@/components/ThemeToggle");
var inter = google_1.Inter({ subsets: ['latin'] });
exports.metadata = {
    title: 'Growlog.ai',
    description: 'Журнал гровера с нейронкой'
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: 'en' },
        React.createElement("body", { className: inter.className },
            React.createElement("div", { className: 'w-[390px] h-[844px] mx-auto border rounded-md shadow bg-white flex flex-col justify-between p-4' },
                React.createElement("div", { className: 'flex-1 overflow-auto' }, children),
                React.createElement("nav", { className: 'border-t mt-4 pt-2 flex justify-around text-xs text-muted-foreground' },
                    React.createElement("a", { href: '/' }, "\uD83D\uDCCA \u0414\u0430\u043D\u043D\u044B\u0435"),
                    React.createElement("a", { href: '/advice' }, "\uD83E\uDDE0 \u0421\u043E\u0432\u0435\u0442\u044B"),
                    React.createElement("a", { href: '/gallery' }, "\uD83D\uDCF7 \u0424\u043E\u0442\u043E"),
                    React.createElement("a", { href: '/settings' }, "\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"),
                    React.createElement(ThemeToggle_1["default"], null))))));
}
exports["default"] = RootLayout;
