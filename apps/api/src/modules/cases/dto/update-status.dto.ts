import { CaseStatus } from "src/database/postgres/entities/case.entity";

export class UpdateStatusDto {
  status!: CaseStatus;
}
