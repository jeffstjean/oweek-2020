const mongoose = require('mongoose');
const QR = require('qrcode');
const path = require('path');
const fs = require('fs')

const code_schema = mongoose.Schema({
    title: { type: String, required: 'A title is required' },
    description: { type: String, required: 'A description is required' },
    location: { type: String, default: 'N/A' },
    url: { type: String },
    points: { type: Number, required: 'A score is required'  }
}, { versionKey: false } );

code_schema.methods.generate_qr = function(hostname) {
    var code = this;
    const url = path.join(hostname, 'code', String(code._id))
    if (!fs.existsSync('./codes/out/')) {
        fs.mkdirSync('./codes/out/')
    }
    QR.toFile(`./codes/out/${code.title}.png`, url, { color: { dark: '#4F2683', light: 'ffffffff' } });
};

module.exports = mongoose.model('code', code_schema);
