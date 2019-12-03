const util = require("util");

const bleno = require("bleno");

const BlenoPrimaryService = bleno.PrimaryService;

const LockCharacteristic = require("../characteristics/lock-characteristic");
const AutoPowerSupplyCharacteristic = require("../characteristics/auto-power-supply-characteristic");
const PowerLevelCharacteristic = require("../characteristics/power-level-characteristic");

function GPIOService() {
  GPIOService.super_.call(this, {
    uuid: "fff0",
    characteristics: [
        // new PowerLevelCharacteristic(),
        new LockCharacteristic(),
        new AutoPowerSupplyCharacteristic(),
    ]
  });
}

util.inherits(GPIOService, BlenoPrimaryService);

module.exports = GPIOService;
