import { Injectable } from '@angular/core';

@Injectable()
export class MaskService {
	showMask = false;

	getMask() {
		return this.showMask;
	}
}
