/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-01 10:33:04
 * @Description:
 */
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = process.env.NEXT_PUBLIC_MOGONDB_URL;

  if (req.method === "POST") {
    const data = req.body;
    const client = await MongoClient.connect(url!);
    const db = client.db();
    const contractDetails = db.collection("contract_details");
    try {
      await contractDetails.updateOne(
        { contractAddress: data.contractAddress },
        {
          $set: {
            state: data.state,
            proposal: data.proposal,
            proposalID: data.proposalID,
            endTime: data.endTime,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }

    client.close();
    res.status(201).json({ message: " Proposal has been sent!" });
  }
};

export default handler;
