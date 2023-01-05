import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { lastValueFrom, observable, Observable, map} from 'rxjs';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadDataService{

  private static members:any
  private static memberparties:any
  private static parties:any
  private static websites:any
  private static defaultProfileImagePath:string = '/assets/img/default-avatar-profile.png'

  constructor(private http: HttpClient) {/*console.log("Costruttore load data")*/}

  getMembers():Observable<any>
  {
    let myObservable: Observable<any>

    if(LoadDataService.members == undefined || LoadDataService.members == null)
      myObservable = this.http.get<any>('https://data.parliament.scot/api/members').pipe(map((members) => {
          //console.log("Chiamata Api members")

          //Adding Name and Surname
          LoadDataService.members = Object.keys(members).map((id) => {
            let foo = members[id]['ParliamentaryName'].split(',')
            let surname = foo[0].trim()
            let name = foo[1].trim()
            members[id]['Name'] = name
            members[id]['Surname'] = surname

            //Adding the deafult profile image
            if(members[id]['PhotoURL'] == "")
              members[id]['PhotoURL'] = LoadDataService.defaultProfileImagePath

            //members[id]['PhotoURL'] = 'https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg'

            return members[id]
          })

          //Shuffle the data
          this.shuffle(LoadDataService.members);

          return LoadDataService.members
        }))
    else
      myObservable = new Observable((observer) =>{
        //console.log("Ritorno members")
        observer.next(LoadDataService.members)
      })

    return myObservable
  }

  private getMemberParties():Observable<any>
  {
    let myObservable: Observable<any>

    if(LoadDataService.memberparties == undefined || LoadDataService.memberparties == null)
      myObservable = this.http.get<any>('https://data.parliament.scot/api/memberparties').pipe(map((memberparties) => {
          //console.log("Chiamata Api memberparties")
          LoadDataService.memberparties = memberparties
          return LoadDataService.memberparties
        }))
    else
      myObservable = new Observable((observer) => {
        //console.log("Ritorno memberparties")
        observer.next(LoadDataService.memberparties)
      })

    return myObservable
  }

  private getParties():Observable<any>
  {
    let myObservable: Observable<any>

    if(LoadDataService.parties == undefined || LoadDataService.parties == null)
      myObservable = this.http.get<any>('https://data.parliament.scot/api/parties').pipe(map((parties) => {
          //console.log("Chiamata Api memberparties")
          LoadDataService.parties = parties
          return LoadDataService.parties
        }))
    else
      myObservable = new Observable((observer) => {
        //console.log("Ritorno parties")
        observer.next(LoadDataService.parties)
      })

    return myObservable
  }

  private getWebsites():Observable<any>
  {
    let myObservable: Observable<any>

    if(LoadDataService.websites == undefined || LoadDataService.websites == null)
      myObservable = this.http.get<any>('https://data.parliament.scot/api/websites').pipe(map((websites) => {
          //console.log("Chiamata Api websites")
          LoadDataService.websites = websites
          return LoadDataService.websites
        }))
    else
      myObservable = new Observable((observer) => {
        //console.log("Ritorno websites")
        observer.next(LoadDataService.websites)
      })

    return myObservable
  }

  getMember(id:number) :Observable<any>
  {
    return this.getMembers().pipe(map((member) => {
      //Maybe implement binary serach
      //Low priority
      for(let i = 0; i < member.length; ++i)
        if(member[i]['PersonID'] == id)
          return member[i]
    }))
  }

  getMemberFullData(id:number) : any
  {
    return forkJoin([this.getMember(id), this.getMemberParties(), this.getParties(), this.getWebsites()]).pipe(map((results:any) => {
      let member = results[0]
      let memberparties = results[1]
      let parties = results[2]
      let websites = results[3]
      let personID = member['PersonID']

      if(member['BirthDate'])
        member['BirthDate'] = new Date(member.BirthDate).toDateString()
      member['Parties'] = this.seachMemberparty(personID, memberparties, parties)
      member['Websites'] = this.searchWebsite(personID, websites)

      return member
    }))
  }

  private seachMemberparty(personID:number, memberparties:any, parties:any):any
  {
    let partiesList = []

    for (let i = 0; i < memberparties.length; i++)
    {
      if(memberparties[i]['PersonID'] == personID)
      {
        //Changing date format and adding it
        //Creating new object
        let party = JSON.parse(JSON.stringify(this.searchParty(memberparties[i]['PartyID'], parties)))
        if(memberparties[i]['ValidFromDate'])
          party.From = new Date(memberparties[i]['ValidFromDate']).toDateString()
        if(memberparties[i]['ValidUntilDate'])
          party.Until = new Date(memberparties[i]['ValidUntilDate']).toDateString()
        partiesList.push(party)
      }
    }

    return partiesList
  }

  private searchParty(partyID:number, parties:any):any
  {
    //Maybe implement binary serach
    //Low priority
    for(let party of parties)
      if(party['ID'] == partyID)
        return party
  }

  private searchWebsite(personID:number, websites:any):any
  {
    let websitesList = []
    for(let website of websites)
      if(website['PersonID'] == personID)
        websitesList.push(website['WebURL'])

    return websitesList
  }

  private shuffle(array:any) :any
  {
    return array.sort(() => Math.random() - 0.5);
  }
}

