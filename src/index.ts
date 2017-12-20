import * as express from 'express';
import uuidv1 = require('uuid/v1');
import 'zone.js';

interface MyRequest extends express.Request {
    trxId: string,
}

class TrxIdVerifier {
    verify(trxId: string) {
        if (trxId === Zone.current.get('trxId')) {
            console.log(`[trxId=${trxId}] Accept`)
        } else {
            console.error(`[trxId=${trxId}] Reject ${Zone.current.get('trxId')}`)
        }
    }
}

const app = express();
const wait = (sec: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, sec);
    });
};

app.use(function (req: MyRequest, res, next) {
    const trxId = uuidv1();
    req.trxId = trxId;
    Zone.current.fork({
        name: 'request',
        properties: {
            trxId: trxId,
        },
    }).run(next);
});

app.get('/', async (req: MyRequest, res) => {
    await wait(Math.random() * 200 + 100);
    const verifier = new TrxIdVerifier();
    verifier.verify(req.trxId)
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('listening port on 3000.');
});