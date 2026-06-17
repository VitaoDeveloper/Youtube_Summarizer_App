import { Summary } from "src/summary/entities/summary.entity";
import { Provider } from "../../../generated/prisma/client";

export class User {    
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public apiKey: string,
    public llmProvider: Provider,
    public Summaries: Summary[],
    public createdAt: Date,
  ) {}
}
