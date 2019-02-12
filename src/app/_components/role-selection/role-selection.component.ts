import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { Role } from '../../_models/role.model';
import { RoleType } from '../../_models/enums';
import { User } from '../../_models/user.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RoleSelectionComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  roles: Role[];
  constructor(private userService: UserService, private router: Router) {

  }

  ngOnInit() {
    this.roles = this.userService.getUserRoles();
    this.initiateSubscriptions();
  }

  initiateSubscriptions(): any {
    this.userSubscription = this.userService.userDetailsUpdated.subscribe((user: User) => {
      this.roles = this.userService.getUserRoles();
    });
  }


  onRoleSelected(type) {
    this.router.navigate([type.toLowerCase()]);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
