import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Speaker} from "../models/speaker";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {
  private speakerControllerUrl: string = "Speaker" // SpeakerController
  constructor(private http: HttpClient) { }

  getAllSpeakers(): Observable<Speaker[]> {
    return this.http.get<Speaker[]>
    (`${environment.apiUrl}/${this.speakerControllerUrl}/GetAllSpeakers`)
  }

  GetSpeakersByProjectId(projectId: string): Observable<Speaker[]> {
    return this.http.get<Speaker[]>
    (`${environment.apiUrl}/${this.speakerControllerUrl}/GetSpeakersByProjectId/${projectId}`)
  }

  getSpeakerById(speakerId: string): Observable<Speaker> {
    return this.http.get<Speaker>
    (`${environment.apiUrl}/${this.speakerControllerUrl}/GetSpeakerById/${speakerId}`)
  }

  createSpeaker(speakerForm: Speaker): Observable<Speaker> {
    return this.http.post<Speaker>
    (`${environment.apiUrl}/${this.speakerControllerUrl}/CreateSpeaker`, speakerForm)
  }

  updateSpeaker(speakerForm: Speaker): Observable<Speaker> {
    return this.http.put<Speaker>
    (`${environment.apiUrl}/${this.speakerControllerUrl}/UpdateSpeaker`, speakerForm)
  }

  removeSpeaker(speakerId: string): Observable<Speaker> {
    return this.http.delete<Speaker>
    (`${environment.apiUrl}/${this.speakerControllerUrl}/RemoveSpeaker/${speakerId}`)
  }
}
