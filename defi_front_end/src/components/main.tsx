/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json"
import { YourWallet } from "./yourWallet/YourWallet";

export type Token = {
    image: string
    address: string
    name: string
}

export const Main = () => {
    const { chainId } = useEthers();
    const networkName = chainId ? helperConfig[chainId] : "dev"

    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero
    console.log(dappTokenAddress)
    console.log(wethTokenAddress)
    console.log(fauTokenAddress)

    const supportedTokens: Array<Token> = [
        {
            image: "ss.",
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: "ss.",
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: "ss.",
            address: fauTokenAddress,
            name: "FAU"
        }

    ]
    return (<YourWallet supportedTokens={supportedTokens} />)
}