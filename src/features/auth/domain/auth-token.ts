export class AuthToken {
  constructor(private readonly value: string) {
    if (!value) throw new Error('Token is required')
  }

  getValue() {
    return this.value
  }
}
