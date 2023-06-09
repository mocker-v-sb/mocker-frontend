import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {RestDomainModule} from '@mocker/rest/domain';
import {TuiLetModule, TuiMapperPipeModule} from '@taiga-ui/cdk';
import {TuiButtonModule} from '@taiga-ui/core';
import {TuiToggleModule} from '@taiga-ui/kit';

import {FeatureRestServiceRoutingModule} from './feature-rest-service-routing.module';
import {FeatureRestServiceComponent} from './feature-rest-service.component';
import {
	RestMockListModule,
	RestModelListModule,
	CreateModelDialogModule,
	CreateMockDialogModule,
} from './components';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FeatureRestServiceRoutingModule,
		RouterModule,
		RestDomainModule,
		TuiButtonModule,
		TuiMapperPipeModule,
		TuiLetModule,
		TuiToggleModule,
		RestMockListModule,
		RestModelListModule,
		CreateModelDialogModule,
		CreateMockDialogModule,
	],
	declarations: [FeatureRestServiceComponent],
})
export class FeatureRestServiceModule {}
