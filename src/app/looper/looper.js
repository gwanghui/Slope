import env from "../env";
import {load} from "../market-api/index";
const BASE = 'BTC';
const looper = {};

export function run(startId, market, options = {}) {
    let {interval = 43200} = options;
    let api = load(market);

    console.log(env.VCTYPES);

    env.VCTYPES.forEach((vctype)=>{
        api.getKlines(BASE, vctype);
    });
    // looper[startId][market] = setTimeout(()=>{
    //     VCTYPES.forEach((vctype)=>{
    //         api.getKlines(BASE, vctype);
    //     }, interval);
    // });
}

export function stop() {

}
