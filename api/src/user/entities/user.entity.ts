export class User {    
  constructor(
    public id: string,
    public slug: string,
    public videoId: string,
    public videoTitle: string,
    public summary: string,
    public topics: string[],
    public language: string,
    public length: string,
    public createdAt: Date,
  ) {}
}
