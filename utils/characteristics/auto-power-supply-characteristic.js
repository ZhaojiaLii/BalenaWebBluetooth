const util = require("util");
const bleno = require("bleno");
const Gpio = require("onoff").Gpio;
const led_pin_2 = process.env.LED_PIN || 22;
const led2 = new Gpio(led_pin_2, "out");
const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

class AutoPowerSupplyCharacteristic {
  constructor() {
    AutoPowerSupplyCharacteristic.super_.call(this, {
      uuid: "d7e84cb2-ff37-4afc-9ed8-5577aeb8454d",
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
    console.log(`auto power supply subscribed, max value size is ${maxValueSize}`);
    this.updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log("auto power supply unsubscribed");
    this.updateValueCallback = null;
  }

  onReadRequest(offset, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      const buf = Buffer.alloc(1);
      buf.writeUInt8(led2.readSync());
      callback(this.RESULT_SUCCESS, buf);
    }
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    let payload = data.readUInt8();
    if (payload === 0 || payload === 1) {
      console.log(`auto power supply status: ${payload ? "up" : "down"}`);
      led2.writeSync(payload);
      callback(this.RESULT_SUCCESS);
    }
  }
}

util.inherits(AutoPowerSupplyCharacteristic, Characteristic);

module.exports = AutoPowerSupplyCharacteristic;
