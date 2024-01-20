import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoginResDto} from "../../models/loginResDto";
import {ProjectReqDto} from "../../models/projectReqDto";
import {Project} from "../../models/project";
import {CrudMethodsEnum} from "../chapter-form-modal/chapter-form-modal.component";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.component.html',
  styleUrls: ['./project-form-modal.component.css']
})
export class ProjectFormModalComponent implements OnInit {
  inputProject?: Project  // Set by parent component
  @Input() loggedInUser!: LoginResDto
  @Output() signalParentComponent: EventEmitter<Project> = new EventEmitter<Project>() // Emit the project form details to the parent component

  crudMethodModeEnum: any = CrudMethodsEnum
  crudMethodMode!: CrudMethodsEnum

  projectForm: FormGroup = this.fb.group({
    id: [''],
    title: [''],
    description: [''],
    ownerId: ['']
  })

  constructor(
    public projectService: ProjectService,
    private fb: FormBuilder
  ) { }
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
    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) { this.createProject(projectReqDto)}
    else if (this.crudMethodMode == this.crudMethodModeEnum.UPDATE) {this.updateProject(projectReqDto)}
    else if (this.crudMethodMode == this.crudMethodModeEnum.DELETE) {this.removeProject(projectReqDto)}
  }

  createProject(projectReqDto: ProjectReqDto) {
    this.projectService.createProject(projectReqDto).subscribe({
      next: (res: Project) => {
        this.signalParentComponent.emit(res) // Update visual display
      },
      error: (err) => { console.log(err) }
    })
  }

  updateProject(projectReqDto: ProjectReqDto) {
    if (projectReqDto) {
      this.projectService.updateProject(projectReqDto).subscribe({
        next: (res: Project) => {
          this.signalParentComponent.emit(res) // Update visual display
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  removeProject(projectReqDto: ProjectReqDto) {
    if (projectReqDto.id!.length > 0) {
      this.projectService.removeProject(projectReqDto.id!).subscribe({
        next: (res: Project) => {
          this.signalParentComponent.emit(res) // Update visual display
        },
        error: (err) => { console.log(err) }
      })
    }
  }


}
