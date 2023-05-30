/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-30 11:06:25
 * @Description: 
 */
export type ContractModel = {
    contractAddress:string
    admin:string
    contractName: string
    Email: string
    receiver: string
    workType: string
    description?: string
    token:string
    amount: number
    timeUint: string
    timeInterval: number
    round: number
    state: string
    proposal?:string 
    proposalID?:string 
    endTime?:string
    upkeeperContract?: string
    image?: string
    
}