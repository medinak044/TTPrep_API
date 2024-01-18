import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudMethodsEnum} from "../chapter-form-modal/chapter-form-modal.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Speaker} from "../../models/speaker";
import {SpeakerService} from "../../services/speaker.service";
import {Project} from "../../models/project";

@Component({
  selector: 'app-speaker-form-modal',
  templateUrl: './speaker-form-modal.component.html',
  styleUrls: ['./speaker-form-modal.component.css']
})
export class SpeakerFormModalComponent implements OnInit {
  currentProject?: Project
  speaker?: Speaker // Set by parent component
  @Output() signalParentComponent: EventEmitter<Speaker> = new EventEmitter<Speaker>() // Let parent component know to refresh its data

  crudMethodModeEnum: any = CrudMethodsEnum
  crudMethodMode!: CrudMethodsEnum

  formGroup: FormGroup = this.fb.group({
    id: [''],
    name: [''],
    projectId: [''],
  })

  constructor(
    private speakerService: SpeakerService,
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
        projectId: ['']
      })
    }

    // Edit and Delete
    if (this.speaker && (
      this.crudMethodMode == this.crudMethodModeEnum.UPDATE
      || this.crudMethodMode == this.crudMethodModeEnum.DELETE)) {
      const {
        id,
        name,
        projectId,
      } = this.speaker

      this.formGroup = this.fb.group({
        id: [id],
        name: [name],
        projectId: [projectId]
      })
    }
  }

  onSubmit() {
    let speaker: Speaker = this.formGroup.value

    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) {
      speaker.projectId = this.currentProject!.id
      this.createSpeaker(speaker)
    }
    else if (this.crudMethodMode == this.crudMethodModeEnum.UPDATE) {this.updateSpeaker(speaker)}
    else if (this.crudMethodMode == this.crudMethodModeEnum.DELETE) {this.removeSpeaker(speaker.id)}

  }

  createSpeaker(form: Speaker) {
    this.speakerService.createSpeaker(form).subscribe({
      next: (res: Speaker) => {
        this.signalParentComponent.emit(res)
      },
      error: (err) => { console.log(err) }
    })
  }

  updateSpeaker(form: Speaker) {
    if (form) {
      this.speakerService.updateSpeaker(form).subscribe({
        next: (res: Speaker) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  removeSpeaker(id: string) {
    if (id.length > 0) {
      this.speakerService.removeSpeaker(id).subscribe({
        next: (res: Speaker) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }


}
