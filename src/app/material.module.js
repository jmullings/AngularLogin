"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jlmconsulting on 9/13/18.
 */
var core_1 = require("@angular/core");
var common_1 = require('@angular/common');
var material_1 = require('@angular/material');
var CustomMaterialModule = (function () {
    function CustomMaterialModule() {
    }
    CustomMaterialModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                material_1.MatToolbarModule,
                material_1.MatButtonModule,
                material_1.MatCardModule,
                material_1.MatInputModule,
                material_1.MatDialogModule,
                material_1.MatTableModule,
                material_1.MatMenuModule,
                material_1.MatIconModule,
                material_1.MatProgressSpinnerModule
            ],
            exports: [
                common_1.CommonModule,
                material_1.MatToolbarModule,
                material_1.MatButtonModule,
                material_1.MatCardModule,
                material_1.MatInputModule,
                material_1.MatDialogModule,
                material_1.MatTableModule,
                material_1.MatMenuModule,
                material_1.MatIconModule,
                material_1.MatProgressSpinnerModule
            ]
        })
    ], CustomMaterialModule);
    return CustomMaterialModule;
}());
exports.CustomMaterialModule = CustomMaterialModule;
//# sourceMappingURL=material.module.js.map