import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoginResDto} from "../../models/loginResDto";
import {ProjectReqDto} from "../../models/projectReqDto";
import {Project} from "../../models/project";

@Component({
  selector: 'app-project-create-modal',
  templateUrl: './project-create-modal.component.html',
  styleUrls: ['./project-create-modal.component.css']
})
export class ProjectCreateModalComponent implements OnInit {
  @Input() loggedInUser!: LoginResDto
  @Input() inputProject!: Project // For reading, updating, deleting
  @Output() sentProjectForm = new EventEmitter<ProjectReqDto>() // Emit the project form details to the parent component


  projectForm: FormGroup = this.fb.group({
    id: [''],
    title: [''],
    description: [''],
    ownerId: ['']
  })

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.initiateForm()  // If project data was passed on to this component, fill out form
  }

  initiateForm() {
    // Map to DTO-like form
    if (this.inputProject) {
      const {
        id,
        title,
        description,
        ownerId
      } = this.inputProject

      this.projectForm = this.fb.group({
        id: [id],
        title: [title],
        description: [description],
        ownerId: [ownerId]
      })
    }
  }

  submitProjectForm() {
    let projectReqDto: ProjectReqDto = this.projectForm.value // Map to DTO
    projectReqDto.ownerId = this.loggedInUser.id // Include owner id
    if (!this.inputProject) { this.createProject(projectReqDto)}
    else if (this.inputProject) {this.updateProject(projectReqDto)}
  }

  createProject(projectReqDto: ProjectReqDto) {
    this.sentProjectForm.emit(projectReqDto)
  }

  updateProject(projectReqDto: ProjectReqDto) {
    this.sentProjectForm.emit(projectReqDto)
  }
}
