const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose')
const router = require('express').Router();
const csv = require('csv-parse/lib/sync');
const archiver = require('archiver');

const Code = require('../models/CodeModel');
const Config = require('../models/ConfigModel');
const { is_user, is_admin } = require('../services/auth')

router.get('/codes', is_admin, async (req, res) => {
    try {
        const codes = (await Code.find({}))
        res.render('codes', { codes })
    }
    catch (e) {
        console.log(e)
        res.send('error')
    }
});

const zip_codes = async (directory) => {
    const output = fs.createWriteStream(path.join(directory, 'codes.zip'));
    const archive = archiver('zip');
    output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    archive.on('error', function(err){
        throw err;
    });
    archive.pipe(output);
    archive.directory(source_dir, false);
    archive.finalize();
}

router.get('/generate', is_admin, async (req, res) => {
    console.log('generating all codes');
    await Code.deleteMany({});
    const data = csv(fs.readFileSync('codes/master_list.csv', 'utf8'), { columns: true, skip_empty_lines: true })
    
    let codes_processed = 0;

    data.forEach(async entry => {
        try {
            entry.points = parseInt(entry.points)
            if(entry.url) entry.url = entry.url.trim()
            const code = await new Code(entry).save();
            code.generate_qr(req.headers.host);
            codes_processed++;
            if(codes_processed === data.length) {
                const output = fs.createWriteStream('codes/codes.zip');
                const archive = archiver('zip');
                output.on('close', () => {
                    console.log(`Codes have been generated (${archive.pointer()} bytes)`)
                    res.download('./codes/codes.zip');
                });
                archive.on('error', () => {
                    throw err;
                });
                archive.pipe(output);
                archive.directory('./codes/out', false);
                archive.finalize();
            }
        } 
        catch(e) {
            console.log(e)
            res.redirect('/codes', {alerts: ['Unable to process codes'] });
        }
    })
});

router.get('/redeem/:_id', is_user, async (req, res) => {
    const user = req.user;
    const config = (await Config.find({}))[0];
    let code = await Code.findById(req.params._id)
    if(!config.is_accepting_points) {
        console.log('not accepting')
        res.render('code', { code, is_accepting_points: false });
    }
    else if(user.codes.indexOf(code._id) === -1) {
        console.log(`${user.displayname} redeemed ${code._id}`)
        user.points += code.points;
        user.codes.push(code._id);
        await user.save();
        res.render('code', { code, already_redeemed: false, is_accepting_points: true }); 
    }
    else {
        console.log(`${user.displayname} has already redeemed ${code._id}`)
        res.render('code', { code, already_redeemed: true, is_accepting_points: true });
    }
});

router.get('/code/:_id', async (req, res) => {
    const _id = req.params._id
    const code = await Code.findById(_id)
    res.render('code', code);
});


module.exports = router;
