import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Project} from "../models/project";
import {ProjectReqDto} from "../models/projectReqDto";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectControllerUrl: string = "Project" // ProjectController

  constructor(private http: HttpClient) { }

  // ---- Project ---- //
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>
    (`${environment.apiUrl}/${this.projectControllerUrl}/GetAllProjects`)
  }

  // Gets user projects based on jwt token claims (user id)
  getUserProjects(): Observable<Project[]> {
    return this.http.get<Project[]>
    (`${environment.apiUrl}/${this.projectControllerUrl}/GetUserProjects`)
  }

  getProjectById(projectId: string): Observable<Project[]> {
    return this.http.get<Project[]>
    (`${environment.apiUrl}/${this.projectControllerUrl}/GetProjectById/{projectId}`)
  }

  createProject(projectReqDto: ProjectReqDto): Observable<Project> {
    return this.http.post<Project>
    (`${environment.apiUrl}/${this.projectControllerUrl}/CreateProject`, projectReqDto)
  }

  updateProject(projectId: string, projectReqDto: ProjectReqDto): Observable<Project> {
    return this.http.put<Project>
    (`${environment.apiUrl}/${this.projectControllerUrl}/UpdateProject/${projectId}`, projectReqDto)
  }

  removeProject(projectId: string): Observable<Project> {
    return this.http.delete<Project>
    (`${environment.apiUrl}/${this.projectControllerUrl}/RemoveProject/${projectId}`)
  }
}
