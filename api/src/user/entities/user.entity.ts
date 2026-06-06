import { Summary } from "src/summary/entities/summary.entity";

export class User {    
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public apiKey: string,
    public Summaries: Summary[],
    public createdAt: Date,
  ) {}
}
