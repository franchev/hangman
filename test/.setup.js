import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cheerio from 'cheerio';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import request from 'supertest';

import app from '../src';

chai.use(sinonChai);
chai.use(chaiAsPromised);

global.app = app;

global.cheerio = cheerio;
global.expect = chai.expect;
global.sinon = sinon;
global.request = request;

global.generateRandomString = (prefix) => `${prefix}-${Math.ceil(Math.random() * 100000)}`;
