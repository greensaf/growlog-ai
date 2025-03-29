'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var PhotoUploader_1 = require("@/components/PhotoUploader");
function JournalPage() {
    var _this = this;
    var _a = react_1.useState(false), recording = _a[0], setRecording = _a[1];
    var _b = react_1.useState(''), transcript = _b[0], setTranscript = _b[1];
    var _c = react_1.useState(null), structuredData = _c[0], setStructuredData = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(null), uploadedUrl = _e[0], setUploadedUrl = _e[1];
    var _f = react_1.useState({}), photoLog = _f[0], setPhotoLog = _f[1];
    var _g = react_1.useState('Есть ли признаки стрессов у растения на фото?'), prompt = _g[0], setPrompt = _g[1];
    var _h = react_1.useState(''), visionResult = _h[0], setVisionResult = _h[1];
    var mediaRecorder;
    var audioChunks = [];
    var startRecording = function () { return __awaiter(_this, void 0, void 0, function () {
        var stream;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream = _a.sent();
                    mediaRecorder = new MediaRecorder(stream);
                    audioChunks = [];
                    mediaRecorder.ondataavailable = function (e) {
                        audioChunks.push(e.data);
                    };
                    mediaRecorder.onstop = function () { return __awaiter(_this, void 0, void 0, function () {
                        var audioBlob, formData, whisperRes, whisperData, parseRes, structured, plantId_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setLoading(true);
                                    audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                                    formData = new FormData();
                                    formData.append('file', audioBlob);
                                    formData.append('model', 'whisper-1');
                                    return [4 /*yield*/, fetch('/api/whisper', {
                                            method: 'POST',
                                            body: formData
                                        })];
                                case 1:
                                    whisperRes = _a.sent();
                                    return [4 /*yield*/, whisperRes.json()];
                                case 2:
                                    whisperData = _a.sent();
                                    setTranscript(whisperData.text);
                                    return [4 /*yield*/, fetch('/api/parse-log', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ transcript: whisperData.text })
                                        })];
                                case 3:
                                    parseRes = _a.sent();
                                    return [4 /*yield*/, parseRes.json()];
                                case 4:
                                    structured = _a.sent();
                                    if (uploadedUrl && (structured === null || structured === void 0 ? void 0 : structured.plantId)) {
                                        plantId_1 = structured.plantId;
                                        setPhotoLog(function (prev) {
                                            var _a;
                                            return (__assign(__assign({}, prev), (_a = {}, _a[plantId_1] = __spreadArrays((prev[plantId_1] || []), [uploadedUrl]), _a)));
                                        });
                                    }
                                    setStructuredData(structured);
                                    return [4 /*yield*/, fetch('/api/save-log', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                plantId: structured.plantId,
                                                data: structured,
                                                transcript: whisperData.text,
                                                photos: __spreadArrays((photoLog[structured.plantId] || []), [uploadedUrl]).filter(Boolean)
                                            })
                                        })];
                                case 5:
                                    _a.sent();
                                    setUploadedUrl(null);
                                    setLoading(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    mediaRecorder.start();
                    setRecording(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var stopRecording = function () {
        mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.stop();
        setRecording(false);
    };
    var handleAnalyzeImage = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!uploadedUrl)
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch('/api/analyze-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ imageUrl: uploadedUrl, prompt: prompt })
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    setVisionResult(data.result);
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: 'space-y-2 text-sm' },
        React.createElement("h2", { className: 'text-lg font-bold' }, "\uD83C\uDF31 \u0417\u0430\u043F\u0438\u0441\u044C Growlog"),
        structuredData ? (React.createElement("pre", { className: 'bg-muted p-2 rounded max-h-72 overflow-auto text-xs' }, JSON.stringify(structuredData, null, 2))) : (React.createElement("p", { className: 'text-muted-foreground' }, "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 REC \u0438 \u043D\u0430\u0447\u043D\u0438\u0442\u0435 \u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C.")),
        React.createElement(PhotoUploader_1["default"], { onUpload: function (url) { return setUploadedUrl(url); } }),
        uploadedUrl && (React.createElement("div", { className: 'space-y-2' },
            React.createElement("img", { src: uploadedUrl, alt: 'Uploaded', className: 'mt-2 w-full rounded' }),
            React.createElement("input", { type: 'text', value: prompt, onChange: function (e) { return setPrompt(e.target.value); }, placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441 \u043A AI...', className: 'w-full text-xs p-2 border rounded bg-white border-gray-300' }),
            React.createElement(button_1.Button, { variant: 'outline', className: 'w-full text-xs', onClick: handleAnalyzeImage }, "\uD83D\uDD0D \u0410\u043D\u0430\u043B\u0438\u0437 \u0444\u043E\u0442\u043E AI"),
            visionResult && (React.createElement("div", { className: 'p-2 text-sm bg-gray-100 rounded text-gray-800' },
                "\uD83E\uDDE0 ",
                React.createElement("strong", null, "AI \u043E\u0442\u0432\u0435\u0442:"),
                " ",
                visionResult)))),
        (structuredData === null || structuredData === void 0 ? void 0 : structuredData.plantId) && photoLog[structuredData.plantId] && (React.createElement("div", { className: 'mt-4' },
            React.createElement("h3", { className: 'text-sm font-semibold mb-1' },
                "\uD83D\uDCF8 \u0424\u043E\u0442\u043E \u0434\u043B\u044F ",
                structuredData.plantId,
                ":"),
            React.createElement("div", { className: 'grid grid-cols-2 gap-2' }, photoLog[structuredData.plantId].map(function (url, index) { return (React.createElement("img", { key: index, src: url, alt: "plant " + index, className: 'w-full rounded' })); })))),
        React.createElement("div", { className: 'flex items-center justify-between mt-4' },
            React.createElement(button_1.Button, { className: 'w-24 h-24 rounded-full text-white text-xl bg-red-600 hover:bg-red-700', onClick: recording ? stopRecording : startRecording }, recording ? '■' : '●'),
            React.createElement("span", { className: 'text-sm text-muted-foreground ml-2' }, "[REC]"))));
}
exports["default"] = JournalPage;
