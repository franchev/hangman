import express from 'express';
import helmet from 'helmet';

import routes from './routes';

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(helmet());

app.use('/', routes);

export default app;
