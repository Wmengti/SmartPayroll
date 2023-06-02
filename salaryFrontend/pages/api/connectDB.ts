/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-01 10:33:08
 * @Description: 
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = process.env.NEXT_PUBLIC_MOGONDB_URL

	if(req.method==='POST'){
    const data = req.body;
    const client = await MongoClient.connect(
      url!
    );
    const db = client.db();
    const contractDetails = db.collection('contract_details');
    const result = await contractDetails.insertOne(data);
    client.close();
    res.status(201).json({ message: ' Proposal has been sent!' });

  }
};

export default handler;
