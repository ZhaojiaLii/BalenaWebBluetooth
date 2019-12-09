const util = require("util");
const bleno = require("bleno");
const Gpio = require("onoff").Gpio;
const powerPIN = process.env.LED_PIN || 4;
const power =  new Gpio(powerPIN, "out");
const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;


class PowerLevelCharacteristic {
  constructor() {
    PowerLevelCharacteristic.super_.call(this, {
      uuid: "d7e84cb2-ff37-4afc-9ed8-5577aeb8454e",
      properties: ["read", "write", "notify"],
      descriptors: [
        new Descriptor({
          uuid: "2901",
          value: "Turn LED on/off"
        })
      ]
    });
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log(`power level subscribed, max value size is ${maxValueSize}`);
    this.updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log("power level unsubscribed");
    this.updateValueCallback = null;
  }

  onReadRequest(offset, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      const buf = Buffer.alloc(1);
      buf.writeUInt8(power.readSync(), 0);
      callback(this.RESULT_SUCCESS, buf);
    }
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    let payload = data.readUInt8();
    if (payload === 0 || payload === 1) {
      console.log(`power level read port status: ${payload ? "open" : "close"}`);
      power.writeSync(payload);
      callback(this.RESULT_SUCCESS);
    }
  }

}

util.inherits(PowerLevelCharacteristic, Characteristic);

module.exports = PowerLevelCharacteristic;
