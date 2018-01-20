import express from 'express';
import bodyParser from 'body-parser';
import logger from './util/logger';
import {run} from './looper/looper';
import pubilcRouter from "./router/public";
import mongoose from "mongoose";


const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});
app.use('/api/v1/public', pubilcRouter);
app.use((err, req, res) => {
    logger.error(err);
    res.status(500).json({
        error: err
    });
});


const PORT = process.env.PORT || 17000;
app.listen(PORT, () => {
    mongoose.connect('mongodb://localhost:27017');
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("db open!");
        run('klines', 'binance');
    });

    logger.info(`Slice app listening on port ${PORT}!`);


});
