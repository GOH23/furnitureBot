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
exports.CalculateEntity = void 0;
const typeorm_1 = require("typeorm");
let CalculateEntity = class CalculateEntity {
};
exports.CalculateEntity = CalculateEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("rowid"),
    __metadata("design:type", String)
], CalculateEntity.prototype, "calculateId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CalculateEntity.prototype, "calculatedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalculateEntity.prototype, "StepOne", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalculateEntity.prototype, "StepTwo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalculateEntity.prototype, "StepThree", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalculateEntity.prototype, "StepFour", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalculateEntity.prototype, "StepFive", void 0);
exports.CalculateEntity = CalculateEntity = __decorate([
    (0, typeorm_1.Entity)("calculate-entity")
], CalculateEntity);
