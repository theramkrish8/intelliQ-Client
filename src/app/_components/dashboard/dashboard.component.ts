import { Component, OnInit } from '@angular/core';
import { Router, UrlTree, UrlSegmentGroup, PRIMARY_OUTLET, UrlSegment } from '@angular/router';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { UtilityService } from 'src/app/_services/utility.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
	constructor(
		private router: Router,
		private localStorageService: LocalStorageService,
		private utilityService: UtilityService
	) {
		const tree: UrlTree = router.parseUrl(this.router.url);
		const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
		const s: UrlSegment[] = g.segments;
		if (s[0].path === 'dashboard' && s[1] && s[1].path) {
			this.localStorageService.addItemToLocalStorage(
				'currentRole',
				this.utilityService.getRoleCode(s[1].path).toString()
			);
		}
	}

	ngOnInit() {}
}
