import request from 'request';
import crypto from 'crypto';
import _ from 'lodash';
import mongoose from "mongoose";
import {coinModel} from "../model/coin-value";

const API_BASE_URL = 'https://api.binance.com/api';

const HEADER = {
	CONTENT_TYPE: 'application/x-www-form-urlencoded',
	API_KEY_HEADER: 'X-MBX-APIKEY'
};

const SIGN = {
	ALGORITHM: 'sha256',
	SIGNATURE_NAME: 'signature',
	TIMESTAMP_NAME: 'timestamp'
};

export function getKlines(base, vcType) {
	return new Promise((resolve, reject) => {
		let requestCoin = vcType+base;
		let option = {
			url: `${API_BASE_URL}/v1/klines?symbol=${requestCoin}&interval=1m`,
			method: `get`
		};
		request(option, (err, res, body) => {
			if (err) {
				throw err;
			}
			resolve(JSON.parse(body));
		});
	}).then(data => {
        console.log(`Receive Coin Data : ${vcType}`);
        data.forEach((coin)=>{
            let coinData = {
                openTime: coin[0],
                open: coin[1],
                high: coin[2],
                low: coin[3],
                close: coin[4],
                closeTime: coin[5],
                coinName: vcType,
                key: ''+coin[0]+':'+vcType
            };
            let task = new coinModel(coinData);
            // console.log(`${vcType} Insert Start`);
            task.save({overwrite: true}, function(err){
                if(err) console.log(err);
            });
        });

		return data;
	})
}

export function getBalances(auth) {
	return callPrivateApi(auth, 'account', 'GET', {}).then(data => {
		return data.balances.reduce((accum, row) => {
			accum[row.asset] = _.floor(Number(row.free) + Number(row.locked), 8);
			return accum;
		}, {});
	});
}


function callPrivateApi(auth, command, method, params = {}) {
	params.timestamp = String(new Date().getTime());
	params.signature = getHmacSha256(auth.secretKey, params);

	const options = {
		method,
		url: `${API_BASE_URL}/${command}`,
		headers: { 'X-MBX-APIKEY': auth.apiKey },
		[method === 'GET' ? 'qs' : 'form']: params,
	}

	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(JSON.parse(body));
		})
	}).then(result => {
		if (result.code < 0) {
			throw result.msg;
		}
		return result;
	});
}

function getHmacSha256(key, params) {
	const uriencodedParams = Object.keys(params).map(key => {
		return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
	}).join('&');

	return crypto.createHmac('sha256', key).update(uriencodedParams).digest('hex');
}
