import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Mountain } from '../_models/mountain';
import { MountainParams } from '../_models/mountainParams';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MountainService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  mountainCache = new Map();
  paginatedResult = signal<PaginatedResult<Mountain[]> | null>(null);
  mountainParams = signal<MountainParams>(new MountainParams);

  resetMountainParams(){
    this.mountainParams.set(new MountainParams);
  }

  getMountains(){
    const response = this.mountainCache.get(Object.values(this.mountainParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.mountainParams().pageNumber, this.mountainParams().pageSize)

    params = params.append("name", this.mountainParams().name as string);
    params = params.append("minHeight", this.mountainParams().minHeight);
    params = params.append("maxHeight", this.mountainParams().maxHeight);
    params = params.append("status", this.mountainParams().status as string);
    params = params.append("orderBy", this.mountainParams().orderBy as string);

    return this.http.get<Mountain[]>(this.baseUrl + "mountains", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.mountainCache.set(Object.values(this.mountainParams()).join("-"), response);
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

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    if (pageNumber && pageSize){
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }

    return params;
  }

  private setPaginatedResponse(response: HttpResponse<Mountain[]>){
    this.paginatedResult.set({
      items: response.body as Mountain[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }
}
