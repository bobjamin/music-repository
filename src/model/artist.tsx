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
        return this.firstName +" " + this.lastName;
    }

    static from(artist: any){
        return new Artist(artist['uid'], artist['firstName'], artist['lastName']);
    }
}