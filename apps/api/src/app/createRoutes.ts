import { Request, Response } from 'express';
import { AvailableParsersDTO } from '@ast-viewer/shared';
import { createGetAvailableParsersDTO } from '../domain/createGetAvailableParsersDTO';
import { parsers } from './parsers';
import { parsers as DEPRECATED_parsers } from '../parsers';

export function createRoutes() {
	const getAvailableParsersDTO = createGetAvailableParsersDTO(parsers);

	async function availableParsersRoute(req: Request, res: Response) {
		const availableParsersDTO: AvailableParsersDTO = await getAvailableParsersDTO();

		res.json(availableParsersDTO);
	}

	async function parseRoute(req: Request, res: Response) {
		const parserName = decodeURIComponent(req.query['parser'] as string);
		const code = decodeURIComponent(req.query['code'] as string);

		const selectedParser = DEPRECATED_parsers.find(p => p.name === parserName);
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
	}

	return {
		availableParsersRoute,
		parseRoute
	};
}