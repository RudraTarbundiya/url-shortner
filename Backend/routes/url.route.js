const express = require('express');
const urlrouter = express.Router();
const {urlController,redirectController,visitController,getAllUrlsController} = require('../controllers/url.controller');
const urlmodel = require('../models/url.model');

urlrouter.post('/short', urlController);

urlrouter.get('/visit/:shortid',visitController);

urlrouter.get('/all', getAllUrlsController);

urlrouter.delete('/delete/:shortid', async (req, res) => {
  try {
    const result = await urlmodel.deleteOne({ ShortedURl: req.params.shortid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

urlrouter.get('/:shortid', redirectController);//akways bellow for not collison

module.exports = urlrouter;
