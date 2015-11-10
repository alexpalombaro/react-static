/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import { describe, it } from 'mocha';
import { expect } from 'chai';

import routes from '../tools/lib/routes-loader';

import fs from 'fs';
import path from 'path';

describe('routes-loader', () => {
  it('Should load a list of routes', function (done) {
    this.cacheable = () => {};
    this.async = () => (err, result) => {
      expect(err).to.equal(null);
      let routes = /\sroutes[\s\S]+?(\{[\s\S]+?\})/.exec(result);
      expect(routes).to.be.an('array');
      expect(routes[1]).to.match(/\'.\/pages\/404\.js\'/);
      done();
    };

    let source = fs.readFileSync(path.resolve(__dirname, '../app.js'), 'utf8');
    routes.call(this, source);
  });
});
