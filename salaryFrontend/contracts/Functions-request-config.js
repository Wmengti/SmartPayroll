/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-26 14:58:08
 * @Description: 
 */
// const fs = require("fs")
// const source = require('./Functions-request-snapshot')
const source = require('./Functions-request-source')

// Loads environment variables from .env.enc file (if it exists)
// require("@/../hardhat/node_modules/@chainlink/env-enc/dist").config()

const Location = {
  Inline: 0,
  Remote: 1,
}

const CodeLanguage = {
  JavaScript: 0,
}

const ReturnType = {
  uint: "uint256",
  uint256: "uint256",
  int: "int256",
  int256: "int256",
  string: "string",
  bytes: "Buffer",
  Buffer: "Buffer",
}

// Configure the request by setting the fields below
const requestConfig =(args)=> {
  return{
  // Location of source code (only Inline is currently supported)
  codeLocation: Location.Inline,
  secretsLocation: Location.Inline,
  // Code language (only JavaScript is currently supported)
  codeLanguage: CodeLanguage.JavaScript,
  // String containing the source code to be executed
  source,
  //source: fs.readFileSync('./API-request-example.js').toString(),
  // Secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
  secrets: {  },
  // Per-node secrets objects assigned to each DON member. When using per-node secrets, nodes can only use secrets which they have been assigned.
  perNodeSecrets: [],
  // ETH wallet key used to sign secrets so they cannot be accessed by a 3rd party
  walletPrivateKey: '',
  // Args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
  args: [args],
  // Expected type of the returned value
  expectedReturnType: ReturnType.string,
  // Redundant URLs which point to encrypted off-chain secrets
  secretsURLs: [],
  globalOffchainSecrets: {},
  // Per-node offchain secrets objects used by the `functions-build-offchain-secrets` command
  perNodeOffchainSecrets: [],
  }
}

module.exports = requestConfig





