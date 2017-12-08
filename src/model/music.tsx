
export class Music{
    uid: number;
    genre: string;
    number?: number;
    opus?: number;
    name?: string;
    artist: number;
    instrument: string;

    constructor(uid: number, name?: string, genre?: string, number?: number, opus?: number) {
        this.uid = uid;
        this.genre = genre;
        this.number = number;
        this.opus = opus;
        this.name = name;
    }

    pieceName(){
        var name = this.name;
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