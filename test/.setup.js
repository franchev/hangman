import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cheerio from 'cheerio';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import request from 'supertest';

import app from '../src';
import { knex } from '../src/lib';
import knexConfig from '../knexfile';

chai.use(sinonChai);
chai.use(chaiAsPromised);

global.app = app;

global.cheerio = cheerio;
global.expect = chai.expect;
global.sinon = sinon;
global.request = request;

global.knex = knex;

global.generateRandomString = (prefix) => `${prefix}-${Math.ceil(Math.random() * 100000)}`;
