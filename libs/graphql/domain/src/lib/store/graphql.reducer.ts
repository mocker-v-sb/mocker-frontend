import {Action, createReducer, on} from '@ngrx/store';
import {GraphQLState} from './graphql.state';
import {graphQLActions} from './graphql.actions';
import {GraphQLServiceShortDto} from '../dtos';

function addMock(service: GraphQLServiceShortDto): GraphQLServiceShortDto {
	return {
		...service,
		mocksCount: (service.mocksCount || 0) + 1,
	};
}

function deleteMock(service: GraphQLServiceShortDto): GraphQLServiceShortDto {
	return {
		...service,
		mocksCount: service.mocksCount! - 1,
	};
}

function deleteAllMocks(
	service: GraphQLServiceShortDto
): GraphQLServiceShortDto {
	return {
		...service,
		mocksCount: 0,
	};
}

const initialState: GraphQLState = {
	dialogLoading: false,
};

const graphQLReducer = createReducer(
	initialState,
	on(graphQLActions.setServices, (state, {services}) => ({
		...state,
		services,
	})),
	on(graphQLActions.setCurrentService, (state, {service}) => ({
		...state,
		currentService: service,
		mocks: service?.mocks || null,
	})),
	on(graphQLActions.setMocks, (state, {mocks}) => ({
		...state,
		mocks,
	})),
	on(graphQLActions.createService, state => ({
		...state,
		dialogLoading: true,
	})),
	on(graphQLActions.serviceCreated, (state, {service}) => ({
		...state,
		services: [
			service as GraphQLServiceShortDto,
			...(state.services || []),
		],
		dialogLoading: false,
	})),
	on(graphQLActions.editService, state => ({
		...state,
		dialogLoading: true,
	})),
	on(graphQLActions.serviceEdited, (state, {service}) => ({
		...state,
		currentService: service,
		services: state.services?.map(item =>
			item.id === service.id
				? ({
						...service,
						mocksCount: service.mocks?.length,
				  } as GraphQLServiceShortDto)
				: item
		),
		dialogLoading: false,
	})),
	on(graphQLActions.historySwitched, (state, {enable}) => ({
		...state,
		currentService: {
			...state.currentService!,
			storeHistory: enable,
		},
	})),
	on(graphQLActions.serviceDeleted, (state, {id}) => ({
		...state,
		services: state.services?.filter(({id: serviceId}) => serviceId !== id),
	})),
	on(graphQLActions.createMock, state => ({
		...state,
		dialogLoading: true,
	})),
	on(graphQLActions.mockCreated, (state, {mock}) => ({
		...state,
		services: state.services?.map(service =>
			service.id === mock.serviceId ? addMock(service) : service
		),
		mocks: [mock, ...(state.mocks || [])],
		dialogLoading: false,
	})),
	on(graphQLActions.editMock, state => ({
		...state,
		dialogLoading: true,
	})),
	on(graphQLActions.mockEdited, (state, {mock}) => ({
		...state,
		mocks: state.mocks!.map(item =>
			item.id === mock.id ? {...mock} : item
		),
		dialogLoading: false,
	})),
	on(graphQLActions.mockDeleted, (state, {mock}) => ({
		...state,
		services: state.services?.map(service =>
			service.id === mock.serviceId ? deleteMock(service) : service
		),
		mocks: state.mocks?.filter(({id}) => id !== mock.id),
	})),
	on(graphQLActions.allMocksDeleted, (state, {serviceId}) => ({
		...state,
		services: state.services?.map(service =>
			service.id === serviceId ? deleteAllMocks(service) : service
		),
		mocks: [],
	})),
	on(graphQLActions.dialogRequestFailure, state => ({
		...state,
		dialogLoading: false,
	})),
	on(graphQLActions.resetState, () => initialState)
);

export function reducer(state: GraphQLState | undefined, action: Action) {
	return graphQLReducer(state, action);
}
