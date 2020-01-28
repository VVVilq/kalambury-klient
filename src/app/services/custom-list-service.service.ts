import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomListServiceService {


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  getUserLists (){
    return this.http.get<any[]>("http://localhost:8080/getAllWordLists")
  }

  addList(list:any){
      return this.http.post<any>("http://localhost:8080/addCustomWordList", list, this.httpOptions)
    }

    editList(list:any,listName:string){
      return this.http.put<any>("http://localhost:8080/editCustomWordList/"+listName, list, this.httpOptions)
    }

    deleteList(name:string){
      return this.http.delete<any>("http://localhost:8080/deleteCustomWordList/"+name)
    }
}
