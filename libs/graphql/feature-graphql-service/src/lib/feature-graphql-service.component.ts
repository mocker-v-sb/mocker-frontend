import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {GraphQLFacade, GraphQLServiceDto} from '@mocker/graphql/domain';
import {
	ENVIRONMENT,
	AppConfig,
	NotificationsFacade,
} from '@mocker/shared/utils';
import {TuiNotification} from '@taiga-ui/core';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';

@Component({
	selector: 'mocker-feature-graphql-service',
	templateUrl: './feature-graphql-service.component.html',
	styleUrls: ['./feature-graphql-service.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureGraphqlServiceComponent {
	readonly service$ = this.facade.currentService$;

	readonly getDate = (expirationDate: string) =>
		format(Date.parse(expirationDate), 'dd MMMM yyyy, HH:mm', {locale: ru});

	readonly getServiceUrl = (name: string) =>
		`${this.appConfig.serverUrl}/graphql/${name}`;

	constructor(
		@Inject(ENVIRONMENT) private readonly appConfig: AppConfig,
		private readonly clipboard: Clipboard,
		private readonly facade: GraphQLFacade,
		private readonly notificationsFacade: NotificationsFacade
	) {}

	copyTextToClipboard(text: string) {
		if (this.clipboard.copy(text)) {
			this.notificationsFacade.showNotification({
				content: 'URL сервиса скопирован в буфер обмена',
				status: TuiNotification.Success,
			});
		}
	}

	editService(service: GraphQLServiceDto) {
		console.log(service);
		// this.dialogService
		// 	.open(
		// 		new PolymorpheusComponent(
		// 			CreateServiceDialogComponent,
		// 			this.injector
		// 		),
		// 		{data: service}
		// 	)
		// 	.subscribe();
	}

	deleteService(id: string) {
		this.facade.deleteService(id);
	}
}
