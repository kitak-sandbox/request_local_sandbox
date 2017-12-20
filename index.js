const express = require('express');
const uuidv1 = require('uuid/v1');
require('zone.js');

class TrxIdVerifier {
    verify(trxId) {
        if (trxId === Zone.current.get('trxId')) {
            console.log(`[trxId=${trxId}] Accept`)
        } else {
            console.error(`[trxId=${trxId}] Reject ${Zone.current.get('trxId')}`)
        }
    }
}

const app = express();
const wait = (sec) => {
    return new Promise((resolve) => {
        setTimeout(resolve, sec);
    });
};

app.use(function (req, res, next) {
    const trxId = uuidv1();
    req.trxId = trxId;
    Zone.current.fork({
        properties: {
            trxId: trxId,
        },
    }).run(next);
});

app.get('/', (req, res) => {
    setTimeout(() => {
        const verifier = new TrxIdVerifier();
        verifier.verify(req.trxId)
        res.send('Hello World!');
    }, Math.random() * 200 + 100);
});

app.listen(3000, () => {
    console.log('listening port on 3000.');
});