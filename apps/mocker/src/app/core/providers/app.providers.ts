import {ENVIRONMENT} from '@mocker/shared/utils';
import {TUI_SANITIZER} from '@taiga-ui/core';
import {NgDompurifySanitizer} from '@tinkoff/ng-dompurify';
import {environment} from '../../../environments/environment';

export const APP_PROVIDERS = [
	{
		provide: TUI_SANITIZER,
		useClass: NgDompurifySanitizer,
	},
	{
		provide: ENVIRONMENT,
		useValue: environment,
	},
];
