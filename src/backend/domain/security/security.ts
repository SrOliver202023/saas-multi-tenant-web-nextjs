export interface IGenerateMagicLinkDto {
  param: string
  token: string
  url: string
}

export interface IGeneratePinDto {
  length: number
}

export class Security {
  static generatePin(props: IGeneratePinDto): string {
    const pins = Array(props.length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
    return pins.join("")
  }

  static generateMagicLink(props: IGenerateMagicLinkDto): string {
    return `${props.url}?${props.param}=${props.token}`
  }
}
