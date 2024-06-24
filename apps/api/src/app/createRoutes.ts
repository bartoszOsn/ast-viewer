import { Request, Response } from 'express';
import { AvailableParsersDTO, ParseDTO } from '@ast-viewer/shared';
import { createGetAvailableParsersDTO } from '../domain/createGetAvailableParsersDTO';
import { parsers } from './parsers';
import { createParseFromPackage } from '../domain/createParseFromPackage';
import { dynamicModulesPath } from './dynamicModulesPath';

export function createRoutes() {
	const getAvailableParsersDTO = createGetAvailableParsersDTO(parsers);
	const parseFromPackage = createParseFromPackage(dynamicModulesPath);

	async function availableParsersRoute(req: Request, res: Response) {
		const availableParsersDTO: AvailableParsersDTO = await getAvailableParsersDTO();

		res.json(availableParsersDTO);
	}

	async function parseRoute(req: Request, res: Response) {
		const parserName = decodeURIComponent(req.query['parser'] as string);
		const parserVersion = decodeURIComponent(req.query['parserVersion'] as string);
		const code = decodeURIComponent(req.query['code'] as string);

		if (!parserName || !parserVersion || !parsers.some(p => p.name === parserName)) {
			res.status(400).send('Parser not found');
			return;
		}

		if (!code) {
			res.status(400).send('Code must be a string');
			return;
		}

		try {
			const parsedCode = await parseFromPackage(code, parserName, parserVersion);

			const dto: ParseDTO = {
				status: 'success',
				ast: parsedCode
			};

			res.json(dto);
		} catch(e: unknown) {
			if (e instanceof Error && hasLocation(e)) {
				const dto: ParseDTO = {
					status: 'failure',
					error: e.message,
					location: {
						start: { line: e.location.start.line, column: e.location.start.column },
						end: { line: e.location.end.line, column: e.location.end.column }
					}
				}
				res.json(dto);
				return;
			}
			const dto: ParseDTO = {
				status: 'failure',
				error: 'Unknown error.',
				location: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 0 }
				}
			}
			res.json(dto);
		}
	}

	return {
		availableParsersRoute,
		parseRoute
	};
}

function hasLocation(e: Error): e is Error & { location: { start: { line: number, column: number }, end: { line: number, column: number } } } {
	return 'location' in e;
}