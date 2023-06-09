import {createAction, props} from '@ngrx/store';
import {
	GraphQLMockDto,
	GraphQLServiceDto,
	GraphQLServiceShortDto,
} from '../dtos';

const loadServices = createAction(
	'[GRAPHQL] Load Services',
	props<{search?: string}>()
);
const setServices = createAction(
	'[GRAPHQL] Set Services',
	props<{services: ReadonlyArray<GraphQLServiceShortDto> | null}>()
);
const setCurrentService = createAction(
	'[GRAPHQL] Set Current Service',
	props<{service: GraphQLServiceDto | null}>()
);
const setMocks = createAction(
	'[GRAPHQL] Set Mocks',
	props<{mocks: ReadonlyArray<GraphQLMockDto> | null}>()
);
const createService = createAction(
	'[GRAPHQL] Create Service',
	props<{service: GraphQLServiceDto}>()
);
const serviceCreated = createAction(
	'[GRAPHQL] Service Created',
	props<{service: GraphQLServiceDto}>()
);
const editService = createAction(
	'[GRAPHQL] Edit Service',
	props<{service: GraphQLServiceDto}>()
);
const serviceEdited = createAction(
	'[GRAPHQL] Service Edited',
	props<{service: GraphQLServiceDto}>()
);
const switchHistory = createAction(
	'[GRAPHQL] Switch History',
	props<{id: string; enable: boolean}>()
);
const historySwitched = createAction(
	'[GRAPHQL] History Switched',
	props<{enable: boolean}>()
);
const deleteService = createAction(
	'[GRAPHQL] Delete Service',
	props<{id: string}>()
);
const serviceDeleted = createAction(
	'[GRAPHQL] Service Deleted',
	props<{id: string}>()
);
const createMock = createAction(
	'[GRAPHQL] Create Mock',
	props<{mock: GraphQLMockDto}>()
);
const mockCreated = createAction(
	'[GRAPHQL] Mock Created',
	props<{mock: GraphQLMockDto}>()
);
const editMock = createAction(
	'[GRAPHQL] Edit Mock',
	props<{mock: GraphQLMockDto}>()
);
const mockEdited = createAction(
	'[GRAPHQL] Mock Edited',
	props<{mock: GraphQLMockDto}>()
);
const switchMock = createAction(
	'[GRAPHQL] Switch Mock',
	props<{mock: GraphQLMockDto}>()
);
const deleteMock = createAction(
	'[GRAPHQL] Delete Mock',
	props<{mock: GraphQLMockDto}>()
);
const deleteAllMocks = createAction('[GRAPHQL] Delete All Mocks');
const mockDeleted = createAction(
	'[GRAPHQL] Mock Deleted',
	props<{mock: GraphQLMockDto}>()
);
const allMocksDeleted = createAction(
	'[GRAPHQL] All Mocks Deleted',
	props<{serviceId: string}>()
);
const dialogRequestFailure = createAction('[GRAPHQL] Dialog Request Failure');
const resetState = createAction('[GRAPHQL] Reset State');

export const graphQLActions = {
	loadServices,
	setServices,
	setCurrentService,
	setMocks,
	createService,
	serviceCreated,
	editService,
	serviceEdited,
	switchHistory,
	historySwitched,
	deleteService,
	serviceDeleted,
	createMock,
	mockCreated,
	editMock,
	mockEdited,
	switchMock,
	deleteMock,
	allMocksDeleted,
	deleteAllMocks,
	mockDeleted,
	dialogRequestFailure,
	resetState,
};
