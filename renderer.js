async function testIt() {
  const filters = [
    { usbVendorId: 0x2A03, usbProductId: 0x0043 },
    { usbVendorId: 0x2E8A, usbProductId: 0x000A }
  ];
let count=0;
const log = [];
  try {
    const port = await navigator.serial.requestPort({filters});
    const portInfo = port.getInfo();
    document.getElementById('device-name').innerHTML = `vendorId: ${portInfo.usbVendorId} | productId: ${portInfo.usbProductId} `
    await port.open({baudRate: 115200});

    while (port.readable) {
     /* const reader = port.readable.getReader();*/

      try {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
          }
          if (value) {
		log[count]=value;
		count++;
            console.log(value);
		//document.getElementById('output').innerHTML = log;
		document.querySelector('textarea').value = log;
          }
        }
      } catch (error) {
        // TODO: Handle non-fatal read error.
      }
    }

  } catch (ex) {
    if (ex.name === 'NotFoundError') {
      document.getElementById('device-name').innerHTML = 'Device NoooOT found'
    } else {
      document.getElementById('device-name').innerHTML = ex
    }
  }
}

document.getElementById('clickme').addEventListener('click',testIt)