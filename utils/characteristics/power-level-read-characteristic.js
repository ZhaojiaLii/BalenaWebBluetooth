const util = require("util");
const bleno = require("bleno");
const Gpio = require("onoff").Gpio;
const gpiop = require('rpi-gpio').promise;
const gpio = require("pi-gpio");
const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

const power_pin_100 = 21;
const power_pin_80 = 20;
const power_pin_60 = 19;
const power_pin_40 = 18;
const power_pin_20 = 17;

const power100 = new Gpio(power_pin_100, "in");
const power80 = new Gpio(power_pin_80, "in");
const power60 = new Gpio(power_pin_60, "in");
const power40 = new Gpio(power_pin_40, "in");
const power20 = new Gpio(power_pin_20, "in");


class PowerLevel100Characteristic {
  constructor() {
    PowerLevel100Characteristic.super_.call(this, {
      uuid: "d7e84cb2-ff37-4afc-9ed8-5577aeb84543",
      properties: ["read", "notify"],
    });
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log(`power level 100 subscribed, max value size is ${maxValueSize}`);
    this.updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log("power level 100 unsubscribed");
    this.updateValueCallback = null;
  }

  onReadRequest(offset, callback) {
      console.log('get here');
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
        // gpio.open(40, "output", function (err) {
        //     gpio.read(40, function (err, value) {
        //         if (err) throw err;
        //         console.log(value);
        //     })
        // });
        // gpiop.setup(40, gpiop.DIR_OUT).then(() => {
        //     console.log( gpiop.read(40));
        //     return gpiop.read(40);
        // }).catch((err) => {
        //     console.log('Error', err.toString())
        // });
       const buf = Buffer.alloc(5);
       buf.writeInt8(power100.readSync(), 0);
       buf.writeInt8(power80.readSync(), 1);
       buf.writeInt8(power60.readSync(), 2);
       buf.writeInt8(power40.readSync(), 3);
       buf.writeInt8(power20.readSync(), 4);
       callback(this.RESULT_SUCCESS, buf);
    }
  }

}

util.inherits(PowerLevel100Characteristic, Characteristic);

module.exports = PowerLevel100Characteristic;
