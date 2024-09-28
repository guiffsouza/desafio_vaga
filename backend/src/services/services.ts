export default class Services {
  static isValidCpfCnpj(cpfCnpj: string) {
    return typeof cpfCnpj === "string" && cpfCnpj.length > 0;
  }

  static parseLine(line: string) {
    const data = line.split(";");
    const parsedData: any = {};
    data.forEach((item: string) => {
      const [key, value] = item.split(":");
      if (key && value) {
        parsedData[key] = value.trim();
      }
    });
    return parsedData;
  }
}
