const util = require("util");
const bleno = require("bleno");
const Gpio = require("onoff").Gpio;
const led_pin_1 = process.env.LED_PIN || 6;
const led1 = new Gpio(led_pin_1, "out");
const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

class LockCharacteristic {
  constructor() {
    LockCharacteristic.super_.call(this, {
      uuid: "d7e84cb2-ff37-4afc-9ed8-5577aeb8454c",
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
    console.log(`lock subscribed, max value size is ${maxValueSize}`);
    this.updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log("lock unsubscribed");
    this.updateValueCallback = null;
  }

  onReadRequest(offset, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      const buf = Buffer.alloc(1);
      buf.writeUInt8(led1.readSync());
      callback(this.RESULT_SUCCESS, buf);
    }
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    let payload = data.readUInt8();
    if (payload === 0 || payload === 1) {
      console.log(`switching lock status: ${payload ? "open" : "close"}`);
      led1.writeSync(payload);
      callback(this.RESULT_SUCCESS);
    }
  }
}

util.inherits(LockCharacteristic, Characteristic);

module.exports = LockCharacteristic;
