import {AbstractControl} from '@angular/forms';
import {TuiValidationError} from '@taiga-ui/cdk';

export const ALLOWED_CODES = [
	100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 300, 301, 302, 303,
	304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410,
	411, 412, 413, 414, 415, 416, 417, 421, 422, 423, 424, 425, 426, 428, 429,
	431, 500, 501, 502, 503, 504, 505, 506, 507, 510, 511,
];

export const statusCodeValidatorFactory =
	(error: string) => (control: AbstractControl) => {
		return !ALLOWED_CODES.includes(control.value)
			? {invalidCode: new TuiValidationError(error)}
			: null;
	};
