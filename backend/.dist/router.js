"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _UserController = require('./app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);

const routes = new (0, _express.Router)();

routes.get('/characters', _UserController2.default.index);
routes.get('/character', _UserController2.default.search);
routes.get('/character/details', _UserController2.default.detail);

exports. default = routes;
