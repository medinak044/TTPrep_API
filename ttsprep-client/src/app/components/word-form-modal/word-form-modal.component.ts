import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {WordService} from "../../services/word.service";

@Component({
  selector: 'app-word-form-modal',
  templateUrl: './word-form-modal.component.html',
  styleUrls: ['./word-form-modal.component.css']
})
export class WordFormModalComponent implements OnInit {
    ngOnInit(): void {
      // this.initiateForm()
    }

  constructor(
    private wordService: WordService,
    private fb: FormBuilder
  ) { }
}
