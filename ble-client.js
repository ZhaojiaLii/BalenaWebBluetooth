class BalenaBLE {
  constructor() {
    this.device = null;
    this.lock = null;
    this.autoPower = null;
    this.powerLevel = null;
    this.cpuVendor = null;
    this.cpuSpeed = null;
    this.power100 = null;
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  /* the LED characteristic providing on/off capabilities */
  async setLedCharacteristic() {
    const service = await this.device.gatt.getPrimaryService(0xfff0);
    this.lock = await service.getCharacteristic(
        "d7e84cb2-ff37-4afc-9ed8-5577aeb8454c"
    );
    await this.lock.startNotifications();
    this.autoPower = await service.getCharacteristic(
        "d7e84cb2-ff37-4afc-9ed8-5577aeb8454d"
    );
    await this.autoPower.startNotifications();
    this.powerLevel = await service.getCharacteristic(
        "d7e84cb2-ff37-4afc-9ed8-5577aeb8454e"
    );
    await this.powerLevel.startNotifications();


    this.lock.addEventListener(
        "characteristicvaluechanged",
        handleLedStatusChanged
    );
    this.autoPower.addEventListener(
        "characteristicvaluechanged",
        handleLedStatusChanged
    );
    this.powerLevel.addEventListener(
        "characteristicvaluechanged",
        handleLedStatusChanged
    );
  }

  /* the Device characteristic providing CPU information */
  async setDeviceCharacteristic() {
    const service = await this.device.gatt.getPrimaryService(0xfff1);
    this.cpuVendor = await service.getCharacteristic(
        "d7e84cb2-ff37-4afc-9ed8-5577aeb84542"
    );

    this.cpuSpeed = await service.getCharacteristic(
        "d7e84cb2-ff37-4afc-9ed8-5577aeb84541"
    );

    this.power100 = await service.getCharacteristic(
        "d7e84cb2-ff37-4afc-9ed8-5577aeb84543"
    );
    await this.power100.startNotifications();
    // this.power100.addEventListener(
    //     "characteristicvaluechanged",
    //     handleLedStatusChanged
    // );
  }

  /* request connection to a BalenaBLE device */
  async request() {
    let options = {
      filters: [
        {
          name: "Relais"
        }
      ],
      optionalServices: [0xfff0, 0xfff1]
    };
    if (navigator.bluetooth === undefined) {
      alert("Sorry, Your device does not support Web BLE!");
      return;
    }
    this.device = await navigator.bluetooth.requestDevice(options);
    if (!this.device) {
      throw "No device selected";
    }
    this.device.addEventListener("gattserverdisconnected", this.onDisconnected);
  }

  /* connect to device */
  async connect() {
    if (!this.device) {
      return Promise.reject("Device is not connected.");
    }
    await this.device.gatt.connect();
  }

  /* read LED state */
  async readLed() {
    await this.lock.readValue();
  }

  async readAuto() {
    await this.autoPower.readValue();
  }
  /* read CPU manufacturer */
  async readCPUVendor() {
    let vendor = await this.cpuVendor.readValue();
    return decode(vendor);
  }

  /* read CPU speed */
  async readCPUSpeed() {
    let speed = await this.cpuSpeed.readValue();
    return decode(speed);
  }

  /* change LED state */
  async writeLed1(data) {
    await this.lock.writeValue(Uint8Array.of(data));
    await this.readLed();
  }

  async writeAuto(data) {
    await this.autoPower.writeValue(Uint8Array.of(data));
    await this.readAuto();
  }
  async readPower() {
    await this.powerLevel.readValue();
  }
  async readPowerOutput() {
    return await this.powerLevel.readValue();
  }
  async writePower(data) {
    await this.powerLevel.writeValue(Uint8Array.of(data));
    await this.readPower();
  }
  async readPower100() {
    const power100 = await this.power100.readValue();
    return decode(power100);
    // return await this.power100.readValue();
  }

  /* disconnect from peripheral */
  disconnect() {
    if (!this.device) {
      return Promise.reject("Device is not connected.");
    }
    return this.device.gatt.disconnect();
  }

  /* handler to run when device successfully disconnects */
  onDisconnected() {
    alert("Device is disconnected.");
    location.reload();
  }
}
