export default class Artist {
    uid: number;
    firstName: string;
    lastName: string;
    knownByLastName: boolean = true;

    constructor(uid: number, firstName: string, lastName: string){
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.knownByLastName = true;
    }

    name(){
        let name = this.lastName;
        if(!this.knownByLastName){
            name = this.firstName +" " + this.lastName;
        }
        return name;
    }

    static from(artist: any){
        return new Artist(artist['uid'], artist['firstName'], artist['lastName']);
    }
}