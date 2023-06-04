/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-04 11:36:35
 * @Description:
 */
import { useState } from 'react';
import { MongoClient } from 'mongodb';
import Image from 'next/image';
import {useRouter} from "next/router";


import CardChakra from '@/components/CreateMoment/CardChakra';
export default function CheckMoment(props:any) {
  // const router = useRouter();
  // const {address} = router.query;
  const [isLoad, setIsLoad] = useState(false);

  const buttonHandle = () => {
    setIsLoad(true);
  };

  return (
    <div>
    <div className='grid grid-cols-4 mt-10 mx-10 gap-10'>
      {
        props.contracts.map((contract:any,index:number)=>(
          <CardChakra key={index} contract={contract}/>
        ))
      }
      
      
    </div>
    {/* <CreateRequest /> */}
    </div>
  );
}

export async function getServerSideProps(context:any) {
  // fetch data from an API
  // const {address} = props
  // const {address} = useAccount();
  const {address} = context.query
  const client = await MongoClient.connect(
    process.env.NEXT_PUBLIC_MOGONDB_URL!
  );
  const db = client.db();
  const contractDetails = db.collection("contract_details");
  const contracts = await contractDetails.find({
    contractAddress:{$ne: ''} ,
    $or:[
      {admin: address},
      {receiver: address}
    ]
  
  }).toArray();
  client.close();

  return {
    props: {
      
      contracts: contracts.map((contract) => ({
        id: contract._id.toString(),
        contractAddress:contract.contractAddress,
        admin:contract.admin,
        contractName:contract.contractName,
        email:contract.Email,
        receiver:contract.receiver,
        workType:contract.workType,
        description:contract.description,
        token:contract.token,
        amount:contract.amount,
        timeUint:contract.timeUint,
        timeInterval:contract.timeInterval,
        round:contract.round,
        state:contract.state,
        proposal:contract.proposal, 
        proposalID:contract.proposalID, 
        endTime:contract.endTime,
        upkeeperContract:contract.upkeeperContract,
        upKeepId:contract.upKeepId||'',
        image:contract.image,
        DAOAddress:contract.DAOAddress||'',
      })),
     
    },
   
  };
}
