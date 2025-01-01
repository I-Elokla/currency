const axios = require("axios");

const BASE_URL = "https://api.frankfurter.app";

class CurrencyService {
  static async getCurrency(base = "EUR") {
    const response = await axios.get(`${BASE_URL}/latest?base=${base}`);
    return response.data;
  }

  static async getCurrencyByDate(date, base = "EUR") {
    const response = await axios.get(`${BASE_URL}/${date}?base=${base}`);
    return response.data;
  }

  static async getCurrencyByDateRange(
    startDate,
    endDate,
    base = "EUR",
    symbols
  ) {
    const url = `${BASE_URL}/${startDate}..${endDate}?base=${base}${
      symbols ? `&symbols=${symbols}` : ""
    }`;
    const response = await axios.get(url);
    return response.data;
  }

  static async convert(base, target, amount) {
    const response = await axios.get(
      `${BASE_URL}/latest?base=${base}&symbols=${target}`
    );
    const rate = response.data.rates[target];
    return {
      base,
      target,
      amount,
      result: amount * rate,
      rate,
    };
  }
}

module.exports = CurrencyService;
