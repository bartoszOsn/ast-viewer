import { ParseDTO, ParseDTOFailure } from '@ast-viewer/shared';

export class ParseResult {
	isValid(): this is ValidParseResult {
		return this instanceof ValidParseResult;
	}

	isInvalid(): this is InvalidParseResult {
		return this instanceof InvalidParseResult;
	}

	static of(dto: ParseDTO): ParseResult {
		if (dto.status === 'success') {
			return new ValidParseResult(dto.ast);
		}

		return new InvalidParseResult(
			dto.error,
			dto.location
		);
	}

	static empty(): ParseResult {
		return new EmptyParseResult();
	}
}

export class ValidParseResult extends ParseResult {
	constructor(
		private readonly ast: unknown
	) {
		super();
	}

	getAst(): unknown {
		return this.ast;
	}
}

export class InvalidParseResult extends ParseResult {
	constructor(
		private readonly error: string,
		private readonly location: ParseDTOFailure['location']
	) {
		super();
	}

	getError(): string {
		return this.error;
	}

	getLocation(): ParseDTOFailure['location'] {
		return this.location;
	}
}

export class EmptyParseResult extends ParseResult {}