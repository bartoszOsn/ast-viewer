import express from 'express';
import { createRoutes } from './app/createRoutes';

const app = express();

const { availableParsersRoute, parseRoute } = createRoutes();

app.get('/available-parsers', availableParsersRoute);
app.get('/parse', parseRoute);

app.listen(3000, () => {
	console.log('Server running on port 3000');
});
