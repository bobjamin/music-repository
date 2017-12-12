
import Artist from "./artist";
export class Music{
    uid: string;
    genre: string;
    number?: number;
    opus?: number;
    name?: string;
    artist: Artist;

    constructor(uid: string, name?: string, genre?: string, number?: number, opus?: number) {
        this.uid = uid;
        this.genre = genre;
        this.number = number;
        this.opus = opus;
        this.name = name;
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
        return new Music(music['uid'], music['name'], music['genre'], music['number'], music['opus']);
    }
}