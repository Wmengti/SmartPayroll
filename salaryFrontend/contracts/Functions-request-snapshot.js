/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-27 11:22:03
 * @Description: 
 */

const source =
`const proposalID = args[0]


if (!proposalID) {
  throw Error("Proposal ID is required")
}


const config = {
  url: "https://testnet.snapshot.org/graphql?",
  method: "POST",
  proxy:false,
  headers: {
    "content-type": "application/json",
  },
  params: {
    operationName: "Proposal",
    query: \`  
    query Proposal {
      proposal(id:"\${proposalID}") {
       id
       votes
       scores
       choices
       state
       scores_total
       quorum
     }
     }
    \`,
    variables: null,
  },
}




const response = await Functions.makeHttpRequest(config)



console.log(response)

const state = response.data.data.proposal.state
const totalScore = response.data.data.proposal.scores_total
const quorum = response.data.data.proposal.quorum

if (state !== "closed") {
  return Functions.encodeString("Vote not ended")
}

if (totalScore < quorum) {
  return Functions.encodeString("Quorum not met")
}

const scores = response.data.data.proposal.scores
const choices = response.data.data.proposal.choices
const highestIndex = scores.indexOf(Math.max(...scores))


return Functions.encodeString(choices[highestIndex])`;

module.exports = source;