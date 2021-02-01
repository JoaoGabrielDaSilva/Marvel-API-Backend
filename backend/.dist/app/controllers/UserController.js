"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);

class UserController {
  constructor() {
    this.baseUrl = 'https://gateway.marvel.com';
    this.apikey = '07f05d67192c439bf8203269fc153fdd';
    this.hash = 'a2110823d4049282bfbe666bd8e79fff';
    this.ts = '1609890812920';
  }

  async index(request, response) {
    const heroes = [];
    const { offset } = request.query;

    const page = offset * 20;
    const url = `https://gateway.marvel.com/v1/public/characters?ts=1609890812920&apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&offset=${page}&limit=100`;
    await _axios2.default
      .get(url)
      .then((data) => {
        const { results } = data.data.data;
        for (let i = 0; i < 20; i += 1) {
          const info = {
            id: results[i].id,
            name: results[i].name,
            image: results[i].thumbnail.path,
            imageFormat: results[i].thumbnail.extension,
            total: data.data.data.total,
          };
          heroes.push(info);
        }
      })
      .catch();
    return response.json(heroes);
  }

  async search(request, response) {
    const { name } = request.query;
    const url = `https://gateway.marvel.com/v1/public/characters?ts=1609890812920&apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff&name=${name}`;
    const res = await _axios2.default
      .get(url)
      .then((data) => {
        const { results } = data.data.data;
        if (results[0]) {
          const info = {
            name: results[0].name,
            image: results[0].thumbnail.path,
            imageFormat: results[0].thumbnail.extension,
          };
          return info;
        }
        return null;
      })
      .catch();
    response.json(res);
  }

  async detail(request, response) {
    const { id } = request.query;
    const url = `https://gateway.marvel.com/v1/public/characters/${id}?ts=1609890812920&apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff`;
    const res = await _axios2.default
      .get(url)
      .then(async (data) => {
        const { results } = data.data.data;
        const { collectionURI } = results[0].comics;
        const comics = [];
        const comicsURL = `${collectionURI}?ts=1609890812920&apikey=07f05d67192c439bf8203269fc153fdd&hash=a2110823d4049282bfbe666bd8e79fff`;

        await _axios2.default
          .get(comicsURL)
          .then((item) => {
            const path = item.data.data.results;

            path.forEach((result) => comics.push(result));
          })
          .catch();

        const details = {
          name: results[0].name,
          description: results[0].description,
          image: results[0].thumbnail.path,
          imageFormat: results[0].thumbnail.extension,
          comics,
        };

        return details;
      })
      .catch();
    response.json(res);
  }
}

exports. default = new UserController();
