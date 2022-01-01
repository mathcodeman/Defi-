/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json"
import { YourWallet } from "./yourWallet/YourWallet";
import DappToken from "./token.png"
import { makeStyles } from "@material-ui/core";
import { TokenFarm } from "./yourTokenFarm/TokenFarm";

export type Token = {
    image: string
    address: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))
export const Main = () => {
    const classes = useStyles()
    const { chainId } = useEthers();
    const networkName = chainId ? helperConfig[chainId] : "dev";

    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero
    console.log(dappTokenAddress)
    console.log(wethTokenAddress)
    console.log(fauTokenAddress)

    const supportedTokens: Array<Token> = [
        {
            image: DappToken,
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
    return (
        <>
            <h2 className={classes.title}>Dapp Token App</h2>
            <YourWallet supportedTokens={supportedTokens} />
            <TokenFarm supportedTokens={supportedTokens}></TokenFarm>
        </>
    )
}