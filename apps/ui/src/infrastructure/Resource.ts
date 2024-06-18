import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AvailableParsersDTO, ParseDTO } from '@ast-viewer/shared';

@Injectable({providedIn: 'root'})
export class Resource {
	private readonly httpClient = inject(HttpClient);

	getAvailableParsers(): Observable<AvailableParsersDTO> {
		return this.httpClient.get<AvailableParsersDTO>('/api/available-parsers');
	}

	getParserOutput(parserName: string, code: string): Observable<ParseDTO> {
		const params = new HttpParams()
			.set('parser', encodeURIComponent(parserName))
			.set('code', encodeURIComponent(code));

		return this.httpClient.get<ParseDTO>(`/api/parse`, { params });
	}
}