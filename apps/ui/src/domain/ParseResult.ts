import { ParseDTO, ParseDTOFailure } from '@ast-viewer/shared';

export class ParseResult {
	isValid(): this is ValidParseResult {
		return this instanceof ValidParseResult;
	}

	asValid(): ValidParseResult {
		if (this.isValid()) {
			return this;
		}

		return new ValidParseResult({});
	}

	isInvalid(): this is InvalidParseResult {
		return this instanceof InvalidParseResult;
	}

	asInvalid(): InvalidParseResult {
		if (this.isInvalid()) {
			return this;
		}

		return new InvalidParseResult('', {
			start: {
				line: 0,
				column: 0
			},
			end: {
				line: 0,
				column: 0
			}
		});
	}

	isEmpty(): this is EmptyParseResult {
		return this instanceof EmptyParseResult;
	}

	isPending(): this is PendingParseResult {
		return this instanceof PendingParseResult;
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

	static pending(): ParseResult {
		return new PendingParseResult();
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

export class PendingParseResult extends ParseResult {}