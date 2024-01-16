import { Component, OnInit } from '@angular/core';
import { LoginResDto } from 'src/app/models/loginResDto';
import { Project } from 'src/app/models/project';
import { AppUserService } from 'src/app/services/app-user.service';
import {ProjectService} from "../../services/project.service";
import {Observable} from "rxjs";
import {ProjectReqDto} from "../../models/projectReqDto";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  loggedInUser!: LoginResDto
  projects?: Project[] = []
  projects$?: Observable<Project[]>
  currentProject?: any // When this is populated with Project data, open the project view component

  projectsFiltered?: Project[] = []
  _filterText: string = ""
  isCreatingNewProject: boolean = false // Switch display over to event form

  get filterText(): string {
    return this._filterText
  }
  set filterText(value:string) {
    this._filterText = value
    this.projectsFiltered = this.filterProjectByTitle(value)
  }

  constructor(
    public appUserService: AppUserService,
    public projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.appUserService.getLocalStorageUser()
    this.getUserProjects() // Get all logged-in user's projects
  }

  switchFormState(isFormActive: boolean) {
    this.isCreatingNewProject = isFormActive
  }

  createProject(projectReqDto: ProjectReqDto) {
    this.projectService.createProject(projectReqDto).subscribe({
      next: (res: any) => {
        this.getUserProjects() // Update visual display
      },
      error: (err) => { console.log(err) }
    })
  }

  // Refresh collection of Projects
  getUserProjects() {
    this.projects$ = this.projectService.getUserProjects() // Gets events relevant to the logged-in user
    // Get non-observable values, associated with the logged-in user
    this.projectService.getUserProjects().subscribe(
      (res:Project[]) => {
        this.projects = res
        this.projectsFiltered = res // Set the same values as well
      }
    )
  }

  setCurrentProject(project: Project) {
    this.currentProject = project // Set the current event based on emitted event id from child component
  }

  // Can be used to switch projects, or go back to project dashboard
  updateCurrentProject(project: Project) {
    this.currentProject = project
  }

  editProject(projectReqDto: ProjectReqDto) {
    if (projectReqDto) {
      this.projectService.updateProject(projectReqDto).subscribe({
        next: (res: any) => {
          this.getUserProjects() // Update visual display
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  removeProject(projectId: string) {
    if (projectId.length > 0) {
      this.projectService.removeProject(projectId).subscribe({
        next: (res: any) => {
          this.getUserProjects() // Update visual display
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  filterProjectByTitle(filterTerm: string){
    if (this.projects?.length === 0 || this.filterText === "") {
      return this.projects
    } else {
      // Return a filtered array
      return this.projects?.filter((project: Project) => {
        // Check if input text matches or partially matches
        return project.title?.toLowerCase().startsWith(filterTerm.toLowerCase())
      })
    }
  }

}
