import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Chapter} from "../../models/chapter";
import {TextBlockLabel} from "../../models/textBlockLabel";
import {Speaker} from "../../models/speaker";
import {SpeakerService} from "../../services/speaker.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CrudMethodsEnum} from "../chapter-form-modal/chapter-form-modal.component";
import {TextBlockLabelService} from "../../services/text-block-label.service";

@Component({
  selector: 'app-textblocklabel-form-modal',
  templateUrl: './textblocklabel-form-modal.component.html',
  styleUrls: ['./textblocklabel-form-modal.component.css']
})
export class TextblocklabelFormModalComponent implements OnInit {
  currentChapter?: Chapter
  textBlockLabel?: TextBlockLabel // Set by parent component
  @Output() signalParentComponent: EventEmitter<TextBlockLabel> = new EventEmitter<TextBlockLabel>() // Let parent component know to refresh its data

  crudMethodModeEnum: any = CrudMethodsEnum
  crudMethodMode!: CrudMethodsEnum

  formGroup: FormGroup = this.fb.group({
    id: [''],
    name: [''],
    chapterId: [''],
  })
  constructor(
    private textBlockLabelService: TextBlockLabelService,
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
        name: [''],
        chapterId: ['']
      })
    }

    // Edit and Delete
    if (this.textBlockLabel && (
      this.crudMethodMode == this.crudMethodModeEnum.UPDATE
      || this.crudMethodMode == this.crudMethodModeEnum.DELETE)) {
      const {
        id,
        name,
        chapterId,
      } = this.textBlockLabel

      this.formGroup = this.fb.group({
        id: [id],
        name: [name],
        chapterId: [chapterId]
      })
    }
  }

  onSubmit() {
    let textBlockLabel: TextBlockLabel = this.formGroup.value

    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) {
      textBlockLabel.chapterId = this.currentChapter!.id
      this.createTextBlockLabel(textBlockLabel)
    }
    else if (this.crudMethodMode == this.crudMethodModeEnum.UPDATE) {this.updateTextBlockLabel(textBlockLabel)}
    else if (this.crudMethodMode == this.crudMethodModeEnum.DELETE) {this.removeTextBlockLabel(textBlockLabel.id)}

  }

  createTextBlockLabel(form: TextBlockLabel) {
    this.textBlockLabelService.createTextBlockLabel(form).subscribe({
      next: (res: TextBlockLabel) => {
        this.signalParentComponent.emit(res)
      },
      error: (err) => { console.log(err) }
    })
  }

  updateTextBlockLabel(form: TextBlockLabel) {
    if (form) {
      this.textBlockLabelService.updateTextBlockLabel(form).subscribe({
        next: (res: TextBlockLabel) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  removeTextBlockLabel(id: string) {
    if (id.length > 0) {
      this.textBlockLabelService.removeTextBlockLabel(id).subscribe({
        next: (res: TextBlockLabel) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

}

