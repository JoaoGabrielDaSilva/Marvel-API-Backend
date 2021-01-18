import { Router } from 'express';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/characters', UserController.index);
routes.get('/character', UserController.search);
routes.get('/character/details', UserController.detail);

export default routes;
