import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
	map,
	catchError,
	switchMap,
	tap,
	withLatestFrom,
	filter,
} from 'rxjs/operators';
import {EMPTY, iif, of} from 'rxjs';
import {NotificationsFacade} from '@mocker/shared/utils';
import {TuiNotification} from '@taiga-ui/core';
import {tuiIsPresent} from '@taiga-ui/cdk';
import {Store} from '@ngrx/store';
import {ROUTER_NAVIGATED, ROUTER_REQUEST} from '@ngrx/router-store';

import {GraphQLApiService} from '../services';
import {graphQLActions} from './graphql.actions';
import {fromGraphQL} from './graphql.selectors';

@Injectable()
export class GraphQLEffects {
	private readonly navigatedToGraphql$ = this.actions$.pipe(
		ofType(ROUTER_NAVIGATED),
		map(({payload: {routerState}}) => routerState as any),
		map(({url}) => url),
		filter(url => url.split('/')[1] === 'graphql')
	);

	private readonly navigatedFromGraphql$ = this.actions$.pipe(
		ofType(ROUTER_REQUEST),
		map(({payload: {routerState, event}}: any) => [
			routerState.url,
			event.url,
		]),
		filter(
			([prevUrl, nextUrl]) =>
				prevUrl.split('/')[1] === 'graphql' &&
				nextUrl.split('/')[1] !== 'graphql'
		)
	);

	resetState$ = createEffect(() =>
		this.navigatedFromGraphql$.pipe(map(() => graphQLActions.resetState()))
	);

	loadServices$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.loadServices),
			switchMap(({search}) =>
				this.apiService.getAllServices(search).pipe(
					map(services => graphQLActions.setServices({services})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось загрузить сервисы',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return of(graphQLActions.setServices({services: null}));
					})
				)
			)
		)
	);

	openService$ = createEffect(() =>
		this.navigatedToGraphql$.pipe(
			withLatestFrom(this.store$.select(fromGraphQL.getServiceId)),
			map(([, id]) => id),
			switchMap(id =>
				iif(
					() => tuiIsPresent(id),
					this.apiService.getService(id!).pipe(
						map(service =>
							graphQLActions.setCurrentService({service})
						),
						catchError(() => {
							this.notificationsFacade.showNotification({
								label: 'Не удалось открыть сервис',
								content: 'Попробуйте еще раз позже',
								status: TuiNotification.Error,
							});
							return EMPTY;
						})
					),
					of(graphQLActions.setCurrentService({service: null}))
				)
			)
		)
	);

	createService$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.createService),
			switchMap(({service}) =>
				this.apiService.createService(service).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: 'Сервис успешно создан',
							status: TuiNotification.Success,
						})
					),
					tap(id => this.router.navigate(['graphql', id])),
					map(id =>
						graphQLActions.serviceCreated({
							service: {
								...service,
								id,
							},
						})
					),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось создать сервис',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return of(graphQLActions.dialogRequestFailure());
					})
				)
			)
		)
	);

	editService$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.editService),
			switchMap(({service}) =>
				this.apiService.editService(service).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: 'Сервис успешно отредактирован',
							status: TuiNotification.Success,
						})
					),
					map(() => graphQLActions.serviceEdited({service})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось отредактировать сервис',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return of(graphQLActions.dialogRequestFailure());
					})
				)
			)
		)
	);

	switchHistory$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.switchHistory),
			switchMap(({id, enable}) =>
				this.apiService.switchHistory(id, enable).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: `Запись истории ${
								enable ? 'включена' : 'выключена'
							}`,
							status: TuiNotification.Success,
						})
					),
					map(() => graphQLActions.historySwitched({enable})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: `Не удалось ${
								enable ? 'включить' : 'выключить'
							} запись истории`,
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});

						return of(
							graphQLActions.historySwitched({enable: !enable})
						);
					})
				)
			)
		)
	);

	deleteService$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.deleteService),
			switchMap(({id}) =>
				this.apiService.deleteService(id).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: 'Сервис удален',
							status: TuiNotification.Success,
						})
					),
					tap(() => this.router.navigate(['graphql'])),
					map(() => graphQLActions.serviceDeleted({id})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось удалить сервис',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return EMPTY;
					})
				)
			)
		)
	);

	createMock$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.createMock),
			switchMap(({mock}) =>
				this.apiService.createMock(mock).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: 'Мок успешно создан',
							status: TuiNotification.Success,
						})
					),
					map(id =>
						graphQLActions.mockCreated({
							mock: {
								...mock,
								id,
							},
						})
					),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось создать мок',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return of(graphQLActions.dialogRequestFailure());
					})
				)
			)
		)
	);

	editMock$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.editMock),
			switchMap(({mock}) =>
				this.apiService.editMock(mock).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: 'Мок успешно отредактирован',
							status: TuiNotification.Success,
						})
					),
					map(() => graphQLActions.mockEdited({mock})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось отредактировать мок',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return of(graphQLActions.dialogRequestFailure());
					})
				)
			)
		)
	);

	switchMock$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.switchMock),
			switchMap(({mock}) =>
				this.apiService.switchMock(mock.id!, !mock.enable).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: `Мок ${
								mock.enable ? 'выключен' : 'включен'
							}`,
							status: TuiNotification.Success,
						})
					),
					map(mock => graphQLActions.mockEdited({mock})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: `Не удалось ${
								mock.enable ? 'выключить' : 'включить'
							} мок`,
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return of(graphQLActions.mockEdited({mock}));
					})
				)
			)
		)
	);

	deleteMock$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.deleteMock),
			switchMap(({mock}) =>
				this.apiService.deleteMock(mock.id!).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: 'Мок удален',
							status: TuiNotification.Success,
						})
					),
					map(() => graphQLActions.mockDeleted({mock})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось удалить мок',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return EMPTY;
					})
				)
			)
		)
	);

	deleteAllMocks$ = createEffect(() =>
		this.actions$.pipe(
			ofType(graphQLActions.deleteAllMocks),
			withLatestFrom(this.store$.select(fromGraphQL.getServiceId)),
			map(([, serviceId]) => serviceId),
			filter(tuiIsPresent),
			switchMap(serviceId =>
				this.apiService.deleteAllMocks(serviceId).pipe(
					tap(() =>
						this.notificationsFacade.showNotification({
							content: 'Все моки сервиса удалены',
							status: TuiNotification.Success,
						})
					),
					map(() => graphQLActions.allMocksDeleted({serviceId})),
					catchError(() => {
						this.notificationsFacade.showNotification({
							label: 'Не удалось удалить моки',
							content: 'Попробуйте еще раз позже',
							status: TuiNotification.Error,
						});
						return EMPTY;
					})
				)
			)
		)
	);

	constructor(
		private readonly actions$: Actions,
		private readonly store$: Store,
		private readonly apiService: GraphQLApiService,
		private readonly notificationsFacade: NotificationsFacade,
		private readonly router: Router
	) {}
}
