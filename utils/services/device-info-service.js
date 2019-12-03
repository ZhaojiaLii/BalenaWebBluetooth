const util = require("util");

const bleno = require("bleno");

const BlenoPrimaryService = bleno.PrimaryService;

const CPUManufacturerCharacteristic = require("../characteristics/cpu-manufacturer-characteristic");
const CPUSpeedCharacteristic = require("../characteristics/cpu-speed-characteristic");


function DeviceInfoService() {
  DeviceInfoService.super_.call(this, {
    uuid: "fff1",
    characteristics: [
        new CPUManufacturerCharacteristic(),
        new CPUSpeedCharacteristic(),
    ]
  });
}

util.inherits(DeviceInfoService, BlenoPrimaryService);

module.exports = DeviceInfoService;
