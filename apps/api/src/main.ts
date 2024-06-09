import express from 'express';
import { parsers } from './parsers';

const app = express();

app.get('/available-parsers', (req, res) => {
	const availableParserNames = parsers.map(parser => parser.name);

	res.json(availableParserNames);
});

app.get('/parse', async (req, res) => {
	const parserName = decodeURIComponent(req.query['parser'] as string);
	const code = decodeURIComponent(req.query['code'] as string);

	const selectedParser = parsers.find(p => p.name === parserName);
	if (!selectedParser) {
		res.status(400).send('Parser not found');
		return;
	}

	if (!code) {
		res.status(400).send('Code must be a string');
		return;
	}

	const parsedCode = await selectedParser.parse(code);
	res.json(parsedCode);
});

app.listen(3000, () => {
	console.log('Server running on port 3000');
});
