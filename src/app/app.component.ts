import { Component, OnInit } from '@angular/core';
import { User } from './_models/user.model';
import { RestService } from './_services/rest.service';
import { Role } from './_models/role.model';
import { RoleType } from './_models/enums';
import { UserService } from './_services/user.service';
import { Question } from './_models/question.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Question Bank';
  currentUser: User;
  loggedIn = false;

  constructor(private userService: UserService, private restService: RestService) {
    userService.userDetailsUpdated.subscribe((user: User) => {
      this.currentUser = user;
      this.loggedIn = user ? true : false;
    });
  }


  updateUsersTemp() {
    var randomRoles = [new Role(RoleType.SUPERADMIN, []),
    new Role(RoleType.APPROVER, []),
    new Role(RoleType.GROUPADMIN, []),
    new Role(RoleType.TEACHER, []),
    new Role(RoleType.SCHOOLADMIN, [])
    ];
    randomRoles = this.shuffleArray(randomRoles);

    var users = [
      new User("1", "Paras", "7401394500", "admin", null, null, null, null, null,
        randomRoles, null, null),
      new User("2", "Raghav", "7401394501", "admin", null, null, null, null, null,
        [new Role(RoleType.TEACHER, []), new Role(RoleType.GROUPADMIN, []), new Role(RoleType.SCHOOLADMIN, [])]
        , null, null),
      new User("3", "Ram", "7401394502", "admin", null, null, null, null, null,
        [new Role(RoleType.APPROVER, []),
        new Role(RoleType.TEACHER, []), new Role(RoleType.SCHOOLADMIN, [])]
        , null, null)
    ];
    this.restService.put("user.json", users).subscribe((response) => document.location.reload());
  }
  updateQuesTemp() {
    var allQuestions = [
      new Question("1", "Question 1", "Question 1 description?", "GK", 3, "1", "2", null, null, null, null, null, null, null, null, null, null), // my
      new Question("2", "Question 2", "Question 2 description?", "English", 4, "2", "3", null, null, null, null, null, null, null, null, null, null),
      new Question("3", "Question 3", "Question 3 description?", "Science", 5, "3", "1", null, null, null, null, null, null, null, null, null, null),
      new Question("4", "Question 4", "Question 4 description?", "Science", 6, "1", "3", null, null, null, null, null, null, null, null, null, null), // my
      new Question("5", "Question 5", "Question 5 description?", "Maths", 3, "1", "2", null, null, null, null, null, null, null, null, null, null), // my
      new Question("6", "Question 6", "Question 6 description?", "English", 4, "2", "3", null, null, null, null, null, null, null, null, null, null),
      new Question("7", "Question 7", "Question 7 description?", "Science", 5, "2", "1", null, null, null, null, null, null, null, null, null, null),
      new Question("8", "Question 8", "Question 8 description?", "GK", 6, "1", "3", null, null, null, null, null, null, null, null, null, null)]; // my

    this.restService.put("question.json", allQuestions).subscribe((response) => console.log(response));

  }
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }



}
