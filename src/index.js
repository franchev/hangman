import bodyparser from 'body-parser';
import express from 'express';
import helmet from 'helmet';

import { requestLogger } from './middleware';
import routes from './routes';

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(requestLogger);
app.use(helmet());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/', routes);

export default app;
