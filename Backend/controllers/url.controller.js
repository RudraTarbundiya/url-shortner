const shortid = require('shortid');
const urlmodel = require('../models/url.model');

const urlController = async (req, res) => {
    console.log("POST /short hit", req.body);
    const { OrginalURl } = req.body;
    const ShortedURl = shortid();
    try {
        const newUrl = await urlmodel.create({ ShortedURl, OrginalURl });
        res.status(201).json(newUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const redirectController = async (req, res) => {
    const shortid = req.params.shortid;
    try {
        const entry = await urlmodel.findOneAndUpdate(
            { ShortedURl: shortid },
            { $inc: { times: 1 } },
            { new: true } // Return the updated document
        );

        if (!entry) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.redirect(entry.OrginalURl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const visitController = async (req, res) => {
    const shortid = req.params.shortid;
    const entry = await urlmodel.findOne({ ShortedURl: shortid });
    res.send(entry);
}

const getAllUrlsController = async (req, res) => {
    try {
        const urls = await urlmodel.find({}).sort({ _id: -1 }); // Most recent first
        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch URLs' });
    }
};

module.exports = { urlController, redirectController, visitController, getAllUrlsController };