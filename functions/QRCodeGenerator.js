const QR = require("qrcode");
const qrCodeGenerator = async (text) => {
    const qrData = await QR.toDataURL(text);
    return qrData;
}
module.exports = qrCodeGenerator;