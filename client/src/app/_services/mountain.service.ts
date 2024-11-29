import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Mountain } from '../_models/mountain';
import { MountainParams } from '../_models/mountainParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { MemberService } from './member.service';

@Injectable({
  providedIn: 'root'
})
export class MountainService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  mountainCache = new Map();
  paginatedResult = signal<PaginatedResult<Mountain[]> | null>(null);
  mountainParams = signal<MountainParams>(new MountainParams);
  memberService = inject(MemberService);

  resetMountainParams(){
    this.mountainParams.set(new MountainParams);
  }

  getMountains(){
    const response = this.mountainCache.get(Object.values(this.mountainParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.mountainParams().pageNumber, this.mountainParams().pageSize)

    params = params.append("name", this.mountainParams().name as string);
    params = params.append("minHeight", this.mountainParams().minHeight);
    params = params.append("maxHeight", this.mountainParams().maxHeight);
    params = params.append("status", this.mountainParams().status as string);
    params = params.append("orderBy", this.mountainParams().orderBy as string);

    return this.http.get<Mountain[]>(this.baseUrl + "mountains", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.mountainCache.set(Object.values(this.mountainParams()).join("-"), response);
      }
    });
  }

  getMountainsClimbedByMember(){
    const response = this.mountainCache.get(Object.values(this.memberService.memberParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.memberService.memberParams().pageNumber, this.memberService.memberParams().pageSize)

    params = params.append("mountainId", this.memberService.memberParams().mountainId);
    params = params.append("knownAs", this.memberService.memberParams().knownAs as string);
    params = params.append("orderBy", this.memberService.memberParams().orderBy as string);

    return this.http.get<Mountain[]>(this.baseUrl + "users/mountains-climbed-by-member", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.mountainCache.set(Object.values(this.memberService.memberParams()).join("-"), response);
      }
    });
  }

  getMountain(id: number){
    const mountain: Mountain = [...this.mountainCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: Mountain) => g.id == id);

    if (mountain) return of(mountain);
    
    return this.http.get<Mountain>(this.baseUrl + `mountains/${id}`);
  }

  createMountain(model: any){
    return this.http.post<Mountain>(this.baseUrl + "mountains", model).pipe(
      tap(() => {
        this.mountainCache.clear();
      })
    );
  }

  editMountain(mountainId: number, model: any){
    return this.http.put<Mountain>(this.baseUrl + `mountains/${mountainId}`, model).pipe(
      tap(() => {
        this.mountainCache.clear();
      })
    );
  }

  deleteMountain(mountainId: number){
    return this.http.delete(this.baseUrl + `mountains/${mountainId}`).pipe(
      tap(() => {
        this.mountainCache.clear();
      })
    );
  }

  markMountainAsClimbed(mountainId: number){
    return this.http.post(this.baseUrl + `mountains/${mountainId}/mark`, {}).pipe(
      tap(() => {
        this.mountainCache.clear();
      })
    );
  }

  unmarkMountainAsClimbed(mountainId: number){
    return this.http.post(this.baseUrl + `mountains/${mountainId}/unmark`, {}).pipe(
      tap(() => {
        this.mountainCache.clear();
      })
    );
  }
}

