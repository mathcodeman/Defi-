import { useEthers, useContractFunction } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/DappToken.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils, Contract } from "ethers";
import { useEffect, useState } from "react";



export const useStakeToken = (tokenAddress: string) => {
    // approve
    //(address,abi,chainId)
    // stake token

    //For Token Farm Contract
    const { chainId } = useEthers();
    const { abi } = TokenFarm;
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)


    //For ERC20 Contract
    const ERC20abi = ERC20.abi;
    const ERC20Interface = new utils.Interface(ERC20abi)
    const ERC20Contract = new Contract(tokenAddress, ERC20Interface)

    // approve function
    const { send: approveErc20Send, state: approveAndStakeErc20State } = useContractFunction(ERC20Contract, "approve", { transactionName: "Approve ERC20 transfer" })
    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }

    // stake function
    const { send: stakeSend, state: stakeState } = useContractFunction(tokenFarmContract, "stakeToken", { transactionName: "Stake Token" })
    const [amountToStake, setAmountToStake] = useState("0");


    //useEffect
    useEffect(() => {
        console.log(tokenFarmContract.interface.functions)
        if (approveAndStakeErc20State.status === "Success") {
            stakeSend(amountToStake, tokenAddress)
        }
    }, [approveAndStakeErc20State])


    return { approveAndStake, approveAndStakeErc20State }
}