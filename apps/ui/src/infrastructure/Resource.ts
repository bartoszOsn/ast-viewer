import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ParseDTO } from '@ast-viewer/shared';

@Injectable({providedIn: 'root'})
export class Resource {
	private readonly httpClient = inject(HttpClient);

	getAvailableParsers(): Observable<Array<string>> {
		return this.httpClient.get<Array<string>>('/api/available-parsers');
	}

	getParserOutput(parserName: string, code: string): Observable<ParseDTO> {
		const params = new HttpParams()
			.set('parser', encodeURIComponent(parserName))
			.set('code', encodeURIComponent(code));

		return this.httpClient.get<ParseDTO>(`/api/parse`, { params });
	}
}