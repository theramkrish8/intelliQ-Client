import { Component, OnInit } from '@angular/core';
import { User } from './_models/user.model';
import { RestService } from './_services/rest.service';
import { UserService } from './_services/user.service';
import { Question } from './_models/question.model';
import { MaskService } from './_services/mask.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Question Bank';
  currentUser: User;
  loggedIn = false;
  showMask = false;
  constructor(private userService: UserService, private restService: RestService, private maskService: MaskService) {
    this.userService.userDetailsUpdated.subscribe((user: User) => {
       this.currentUser = user;
      this.loggedIn = user ? true : false;
    });
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



}
