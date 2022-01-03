import { useEthers, useContractCall } from "@usedapp/core"
import { constants, utils } from "@usedapp/core/node_modules/ethers"
import { BigNumber } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"


export const useTokenBalance = (address: string): BigNumber | undefined => {
    //Get token farm contract
    const { chainId, account } = useEthers();
    const { abi } = TokenFarm;
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)

    //Call getUserSingleTokenValue function which returns view value
    const [TokenBalance] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmAddress,
        method: "getUserSingleTokenValue",
        args: [account, address],
    }) ?? []

    return TokenBalance
}