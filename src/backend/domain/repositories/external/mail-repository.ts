import { IMailProps } from "../../entities";

export abstract class IMailRepository {
  abstract send(props: IMailProps): Promise<void>;
}
