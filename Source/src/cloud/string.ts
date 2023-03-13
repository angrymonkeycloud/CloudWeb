export class CoreString {
  static randomLetters(length: number): string {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
  }

  static randomNumbers(length: number): string {
    let result = "";
    let characters = "012345678911";
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
  }

  static random(length: number): string {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
  }
}
