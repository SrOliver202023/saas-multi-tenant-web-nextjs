export interface IMailProps {
  to: string;
  subject: string;
  html: string;
}

export class Mail<Props> implements IMailProps {
  private props: IMailProps & Props;

  protected constructor(props: IMailProps & Props) {
    this.props = props;
  }

  get to() {
    return this.props.to;
  }

  get subject() {
    return this.props.subject;
  }

  get html() {
    return this.props.html;
  }
}
