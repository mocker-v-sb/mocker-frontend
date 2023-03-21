import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {RestServiceDto, RestServiceListDto, RestServiceShortDto} from '../dtos';

@Injectable()
export class RestServiceApiService {
	constructor(private readonly httpClient: HttpClient) {}

	getAllServices(
		search?: string
	): Observable<ReadonlyArray<RestServiceShortDto>> {
		return this.httpClient
			.get<RestServiceListDto>('api/rest/services', {
				...(search && {
					params: new HttpParams({
						fromObject: {search},
					}),
				}),
			})
			.pipe(map(({services}) => services));
	}

	getService(servicePath: string): Observable<RestServiceDto> {
		return this.httpClient.get<RestServiceDto>(
			`api/rest/service/${servicePath}`
		);
	}

	createService(service: RestServiceDto): Observable<void> {
		return this.httpClient.post<void>('api/rest/service', service);
	}

	editService(path: string, service: RestServiceDto): Observable<void> {
		return this.httpClient.put<void>(`api/rest/service/${path}`, service);
	}

	deleteService(servicePath: string): Observable<void> {
		return this.httpClient.delete<void>(`api/rest/service/${servicePath}`);
	}
}
