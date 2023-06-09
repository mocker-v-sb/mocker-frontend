import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiTableModule, TuiTablePaginationModule} from '@taiga-ui/addon-table';
import {TuiButtonModule, TuiHintModule, TuiTooltipModule} from '@taiga-ui/core';

import {RestModelListComponent} from './rest-model-list.component';

@NgModule({
	declarations: [RestModelListComponent],
	imports: [
		CommonModule,
		TuiTableModule,
		TuiButtonModule,
		TuiTablePaginationModule,
		TuiTooltipModule,
		TuiHintModule,
	],
	exports: [RestModelListComponent],
})
export class RestModelListModule {}
