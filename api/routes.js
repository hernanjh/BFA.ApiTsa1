const { Router } = require('express');
const router = Router();
const config = require('./config.js');
const BfaController = require('./bfacontroller.js');


router.get('/status', (req, res) => {    
    res.send('ok');
})

router.get('/address', (req, res) => {    
    res.send(config.account.address);
})

router.get('/balance', async (req, res) => {    
    await BfaController.balance(req, res);
})

router.get('/block', async (req, res) => {    
    await BfaController.block(req, res);
})

router.get('/tx', async (req, res) => {    
    await BfaController.tx(req, res);
})

router.post('/stamp', async (req, res) => {   
    await BfaController.stamp(req, res);
})

router.post('/verify', async (req, res) => {    
    await BfaController.verify(req, res);
})


module.exports = router;