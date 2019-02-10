import { Component, OnInit } from '@angular/core';
import { User } from './_models/user.model';
import { AuthenticationService } from './_services/authentication.service';
import { HttpService } from './_services/http.service';
import { Role } from './_models/role.model';
import { RoleType } from './_models/enums';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Question Bank';
  currentUser: User;
  loggedIn = false;
  constructor(private userService: UserService, private httpService: HttpService) {
    // this.authService.getCurrentUser();
    userService.userDetailsUpdated.subscribe((user: User) => {
      this.currentUser = user;
      this.loggedIn = true;
    });
  }
  updateUsersTemp() {
    var users = [
      new User("1", "Paras", "7401394500", "admin", null, null, null, null, null,
        [new Role(RoleType.SUPERADMIN, []), new Role(RoleType.APPROVER, []),
        new Role(RoleType.GROUPADMIN, []), new Role(RoleType.TEACHER, [])]
        , null, null),
      new User("2", "Raghav", "7401394501", "admin", null, null, null, null, null,
        [new Role(RoleType.TEACHER, []), new Role(RoleType.GROUPADMIN, []), new Role(RoleType.SCHOOLADMIN, [])]
        , null, null),
      new User("3", "Ram", "7401394502", "admin", null, null, null, null, null,
        [new Role(RoleType.APPROVER, []),
        new Role(RoleType.TEACHER, []), new Role(RoleType.SCHOOLADMIN, [])]
        , null, null)
    ];
    this.httpService.put("user.json", users).subscribe((response) => document.location.reload());
  }
  ngOnInit() {
    // this.authService.loggedInUserChanged.subscribe((user: User) => {
    //   this.currentUser = user;
    //   if (this.currentUser) {
    //     this.loggedIn = true;
    //   }
    //   else {
    //     this.loggedIn = false;
    //   }
    // });

  }
}
