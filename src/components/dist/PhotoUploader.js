'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("@uploadthing/react");
function PhotoUploader(_a) {
    var onUpload = _a.onUpload;
    return (React.createElement(react_1.UploadDropzone, { endpoint: 'imageUploader', onClientUploadComplete: function (res) {
            var _a;
            if (res && ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.url)) {
                onUpload(res[0].url);
            }
        }, onUploadError: function (error) {
            alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: " + error.message);
        }, appearance: {
            button: 'hidden',
            container: 'flex flex-col items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-md w-full bg-gray-50 hover:bg-gray-100 cursor-pointer transition',
            label: 'text-sm text-muted-foreground'
        }, content: {
            label: (React.createElement("div", { className: 'flex flex-col items-center text-muted-foreground' },
                React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', className: 'h-8 w-8 text-gray-400 mb-1', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5 },
                    React.createElement("path", { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M3 16.5V14a4.5 4.5 0 014.5-4.5h1.55a4.5 4.5 0 013.9 2.25M19.5 13.5V12a4.5 4.5 0 00-4.5-4.5h-.379a4.5 4.5 0 00-3.878 2.086' }),
                    React.createElement("path", { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M16.5 16.5L12 12m0 0l-4.5 4.5M12 12v9' })),
                React.createElement("span", null, "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438 \u0444\u043E\u0442\u043E \u0441\u044E\u0434\u0430 \u0438\u043B\u0438 \u043A\u043B\u0438\u043A\u043D\u0438")))
        } }));
}
exports["default"] = PhotoUploader;
