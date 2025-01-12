"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var grammy_1 = require("grammy");
var typeorm_1 = require("typeorm");
var conversations_1 = require("@grammyjs/conversations");
var dotenv_1 = require("dotenv");
var calculate_entity_1 = require("./entities/calculate.entity");
var furniture_entity_1 = require("./entities/furniture.entity");
var services_entity_1 = require("./entities/services.entity");
(0, dotenv_1.config)();
var bot = new grammy_1.Bot(process.env.BOT_TOKEN);
bot.use((0, grammy_1.session)({ initial: function () { return ({}); } }));
bot.use((0, conversations_1.conversations)());
bot.api.setMyCommands([
    { command: 'start', description: 'Веб приложение "Sadovolk Store"' },
    { command: 'donate', description: 'Пополнение на ваш аккаунт звездами' }
]);
var AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DBHOST,
    port: 3306,
    username: process.env.DBUSERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DBPASS,
    logging: true,
    entities: [calculate_entity_1.CalculateEntity, furniture_entity_1.FurnitureService, services_entity_1.Services],
});
// Handle the /start command.
bot.command("start", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.reply("При нажатии на кнопку 'Открыть наш магазин'\nВы подтверждаете политику публичной <a href=''>оферты</a>", {
                    reply_markup: grammy_1.InlineKeyboard.from([
                        [{ text: 'Открыть наш магазин', web_app: { url: "https://telegram-template-nextjs.vercel.app" } }]
                    ]),
                    parse_mode: 'HTML'
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.catch(function (err) {
    var ctx = err.ctx;
    console.error("Error while handling update ".concat(ctx.update.update_id, ":"));
    var e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
AppDataSource.initialize()
    .then(function () {
    console.log("Data Source has been initialized!");
    bot.start();
})
    .catch(function (err) {
    console.error("Error during Data Source initialization", err);
});
