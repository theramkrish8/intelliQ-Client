import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {
	constructor(private toastr: ToastrService) {}

	showSuccessWithTimeout(message, title, timespan) {
		this.toastr.success(message, title, {
			timeOut: timespan,
			positionClass: 'toast-top-center'
		});
	}

	showErrorWithTimeout(message, title, timespan) {
		this.toastr.error(message, title, {
			timeOut: timespan,
			positionClass: 'toast-top-center'
		});
	}
}
