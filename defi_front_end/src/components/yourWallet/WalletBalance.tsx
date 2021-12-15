import { Token } from "../main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import { BalanceMsg } from "./BalanceMsg";


export interface WalletBalanceProps {
    token: Token
}



export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    console.log(formattedTokenBalance)
    return (<BalanceMsg label={name} amount={formattedTokenBalance} tokenImgSrc={image}></BalanceMsg>)
}