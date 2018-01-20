import env from "../env";
import {load} from "../market-api/index";
const BASE = 'BTC';
let looper = {};

export function run(startId, market, options = {}) {
    let {interval = 29000000} = options;

    env.VCTYPES.forEach((vctype)=>{
        load(market).getKlines(BASE, vctype);
    });

    setInterval(()=>{
        env.VCTYPES.forEach((vctype)=>{
            load(market).getKlines(BASE, vctype);
        });
    }, interval);
}

export function stop() {

}
