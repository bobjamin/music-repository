
import Artist from "./artist";
export class Music{
    uid: string;
    genre: string;
    owner: string;
    number?: number;
    opus?: number;
    name?: string;
    artist: Artist;
    groups: Array<string>;
    tags: Array<string>;

    constructor(uid: string, name?: string, genre?: string, owner?: string, number?: number, opus?: number, groups?: Array<string>, tags?: Array<string>) {
        this.uid = uid;
        this.genre = genre;
        this.number = number;
        this.opus = opus;
        this.name = name;
        this.groups = groups;
        this.tags = tags;
        this.owner = owner;
    }

    pieceName(){
        let name = this.name;
        if(!name){
            name = this.genre;
            if(this.number){
                name += ' No. ' + this.number;
            }
            if(this.opus){
                name += ' Op. ' + this.opus;
            }
        }
        return name;
    }

    static from(music: any){
        return new Music(music['uid'], music['name'], music['genre'], music['oid'], music['number'], music['opus'], music['groups'], music['tags']);
    }
}