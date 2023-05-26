/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-26 15:06:00
 * @Description:
 */
// No authentication. demonstrate POST with data in body
// callgraphql api: https://github.com/trevorblades/countries
// docs: https://trevorblades.github.io/countries/queries/continent

// make HTTP request
const source =`
const countryCode = args[0]
const url = "https://countries.trevorblades.com/"

const countryRequest = Functions.makeHttpRequest({
  url: url,
  method: "POST",
  data: {
    query: \`{\
        country(code: "JP") { \
          name \
          capital \
          currency \
        } \
      }\`,
  },
})

// Execute the API request (Promise)
const countryResponse = await countryRequest

const countryData = countryResponse["data"]["data"]



console.log("country response", countryData)

// result is in JSON object
const result = {
  name: countryData.country.name,
  capital: countryData.country.capital,
  currency: countryData.country.currency,
}

// Use JSON.stringify() to convert from JSON object to JSON string
// Finally, use the helper Functions.encodeString() to encode from string to bytes
return Functions.encodeString(JSON.stringify(result))

`
module.exports = source;