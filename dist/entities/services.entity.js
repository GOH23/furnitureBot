"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Services = void 0;
const typeorm_1 = require("typeorm");
const furniture_entity_1 = require("./furniture.entity");
let Services = class Services {
};
exports.Services = Services;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Services.prototype, "serviceID", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Services.prototype, "Name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Services.prototype, "Image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Services.prototype, "Price", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false, default: true }),
    __metadata("design:type", Boolean)
], Services.prototype, "Blocked", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => furniture_entity_1.FurnitureService, entity => entity.Services, {
        onDelete: "CASCADE"
    }),
    __metadata("design:type", furniture_entity_1.FurnitureService)
], Services.prototype, "Service", void 0);
exports.Services = Services = __decorate([
    (0, typeorm_1.Entity)("services")
], Services);
