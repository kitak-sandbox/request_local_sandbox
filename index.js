const express = require('express');
const uuidv1 = require('uuid/v1');
require('zone.js');

class Foo {
    constructor() {
        console.log(`[trxId=${Zone.current.get('trxId')}]: create Foo instance`)
    }
}

const app = express();

app.use(function (req, res, next) {
    Zone.current.fork({
        properties: {
            trxId: uuidv1(),
        },
    }).run(next);
});

app.get('/', (req, res) => {
    console.log(Zone.current.get('trxId'));
    new Foo();
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('listening port on 3000.');
});