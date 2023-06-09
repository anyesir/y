#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("./"));
const os_1 = require("os");
try {
    console.log(_1.default(process.argv[2]));
}
catch (err) {
    console.error(os_1.networkInterfaces());
    throw err;
}
