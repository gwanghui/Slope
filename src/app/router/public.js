import { Router } from 'express';
import * as marketApi from '../market-api';
import logger from '../util/logger';

let router = Router();
router.use((req, res, next) => {
  logger.verbose(`[${Date()}] ${req.url} called`);
  next();
});

router.get('/markets/:market/kline/:base?/:vcType?', (req, res) => {
  marketApi.load(req.params.market).getKlines(req.params.base, req.params.vcType).then(klines => {
      res.json(klines);
  });
});

export default router;
