import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WordService} from "../../services/word.service";
import {Project} from "../../models/project";
import {Word} from "../../models/word";
import {CrudMethodsEnum} from "../chapter-form-modal/chapter-form-modal.component";

@Component({
  selector: 'app-word-form-modal',
  templateUrl: './word-form-modal.component.html',
  styleUrls: ['./word-form-modal.component.css']
})
export class WordFormModalComponent implements OnInit {
  currentProject?: Project
  word?: Word // Set by parent component
  @Output() signalParentComponent: EventEmitter<Word> = new EventEmitter<Word>() // Let parent component know to refresh its data

  crudMethodModeEnum: any = CrudMethodsEnum
  crudMethodMode!: CrudMethodsEnum

  formGroup: FormGroup = this.fb.group({
    id: [''],
    originalSpelling: ['', [Validators.required, Validators.minLength(1)]],
    modifiedSpelling: [''],
    projectId: [''],
  })
  // get f() { return this.formGroup.controls } // Getter method for displaying error messages

  constructor(
    private wordService: WordService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initiateForm()
  }

  initiateForm() {
    // Create
    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) {
      this.formGroup = this.fb.group({
        id: [''],
        originalSpelling: [''],
        modifiedSpelling: [''],
        projectId: ['']
      })
    }

    // Edit and Delete
    if (this.word && (
      this.crudMethodMode == this.crudMethodModeEnum.UPDATE
      || this.crudMethodMode == this.crudMethodModeEnum.DELETE)) {
      const {
        id,
        originalSpelling,
        modifiedSpelling,
        projectId,
      } = this.word

      this.formGroup = this.fb.group({
        id: [id],
        originalSpelling: [originalSpelling],
        modifiedSpelling: [modifiedSpelling],
        projectId: [projectId]
      })
    }
  }

  onSubmit() {
    let word: Word = this.formGroup.value

    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) {
      word.projectId = this.currentProject!.id
      this.createWord(word)
    }
    else if (this.crudMethodMode == this.crudMethodModeEnum.UPDATE) {this.updateWord(word)}
    else if (this.crudMethodMode == this.crudMethodModeEnum.DELETE) {this.removeWord(word.id)}

  }

  createWord(form: Word) {
    this.wordService.createWord(form).subscribe({
      next: (res: Word) => {
        this.signalParentComponent.emit(res)
      },
      error: (err) => { console.log(err) }
    })
  }

  updateWord(form: Word) {
    if (form) {
      this.wordService.updateWord(form).subscribe({
        next: (res: Word) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  removeWord(id: string) {
    if (id.length > 0) {
      this.wordService.removeWord(id).subscribe({
        next: (res: Word) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }


}
