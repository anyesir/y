"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMAC = void 0;
// Prepare
const os_1 = require("os");
const macRegex = /(?:[a-z0-9]{1,2}[:-]){5}[a-z0-9]{1,2}/i;
const zeroRegex = /(?:[0]{1,2}[:-]){5}[0]{1,2}/;
/**
 * Get the first proper MAC address
 * @param iface If provided, restrict MAC address fetching to this interface
 */
function getMAC(iface) {
    const list = os_1.networkInterfaces();
    if (iface) {
        const parts = list[iface];
        if (!parts) {
            throw new Error(`interface ${iface} was not found`);
        }
        for (const part of parts) {
            if (zeroRegex.test(part.mac) === false) {
                return part.mac;
            }
        }
        throw new Error(`interface ${iface} had no valid mac addresses`);
    }
    else {
        for (const [key, parts] of Object.entries(list)) {
            // for some reason beyond me, this is needed to satisfy typescript
            // fix https://github.com/bevry/getmac/issues/100
            if (!parts)
                continue;
            for (const part of parts) {
                if (zeroRegex.test(part.mac) === false) {
                    return part.mac;
                }
            }
        }
    }
    throw new Error('failed to get the MAC address');
}
exports.default = getMAC;
/** Check if the input is a valid MAC address */
function isMAC(macAddress) {
    return macRegex.test(macAddress);
}
exports.isMAC = isMAC;
