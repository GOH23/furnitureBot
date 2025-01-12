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
exports.FurnitureService = void 0;
const typeorm_1 = require("typeorm");
const services_entity_1 = require("./services.entity");
let FurnitureService = class FurnitureService {
};
exports.FurnitureService = FurnitureService;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], FurnitureService.prototype, "serviceID", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], FurnitureService.prototype, "serviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], FurnitureService.prototype, "serviceSellCount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => services_entity_1.Services, entity => entity.Service, { cascade: true }),
    __metadata("design:type", Array)
], FurnitureService.prototype, "Services", void 0);
exports.FurnitureService = FurnitureService = __decorate([
    (0, typeorm_1.Entity)("furniture-service")
], FurnitureService);
