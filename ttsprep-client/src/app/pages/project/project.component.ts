import {Component, Input, OnInit} from '@angular/core';
import {LoginResDto} from "../../models/loginResDto";
import {Project} from "../../models/project";
import {FormBuilder} from "@angular/forms";
import {ProjectService} from "../../services/project.service";
import {ProjectReqDto} from "../../models/projectReqDto";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @Input() loggedInUser!: LoginResDto
  @Input() inputProject!: Project

  constructor(
    public projectService: ProjectService,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.getProjectById() // Get project data from db

    // this.initiateForm()  // If project data was passed on to this component, fill out form
  }

  getProjectById() {
    console.log(this.inputProject.id)
    this.projectService.getProjectById(this.inputProject.id).subscribe({
      next: (res: Project) => {
        this.inputProject = res // Update visual display
      },
      error: (err) => { console.log(err) }
    })
  }

  editProject(projectReqDto: ProjectReqDto) {
    if (projectReqDto) {
      this.projectService.updateProject(projectReqDto).subscribe({
        next: (res: Project) => {
          this.inputProject = res // Update visual display
        },
        error: (err) => { console.log(err) }
      })
    }
  }


}
