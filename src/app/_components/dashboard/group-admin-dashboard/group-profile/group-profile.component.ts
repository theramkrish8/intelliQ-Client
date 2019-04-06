import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupService } from 'src/app/_services/group.service';
import { Group } from 'src/app/_models/group.model';
import { Observable, of, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { Constants } from 'src/app/_common/constants';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-group-profile',
	templateUrl: './group-profile.component.html',
	styleUrls: [ './group-profile.component.css' ]
})
export class GroupProfileComponent implements OnInit, OnDestroy {
	group$: Observable<Group>;
	groupSubscription: Subscription;
	constructor(private groupService: GroupService, private localStorageService: LocalStorageService) {}

	ngOnInit() {
		var group = this.localStorageService.getItemFromLocalStorage('group', true);
		if (group) {
			this.group$ = of(group);
		} else {
			this.initiateSubscriptions();
		}
	}
	initiateSubscriptions() {
		this.groupSubscription = this.groupService.groupFetched.subscribe((group: Group) => {
			this.group$ = of(group);
		});
	}
	ngOnDestroy() {
		if (this.groupSubscription) {
			this.groupSubscription.unsubscribe();
		}
	}
}
