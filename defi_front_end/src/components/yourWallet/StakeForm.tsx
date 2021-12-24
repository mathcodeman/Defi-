import { Token } from "../main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import { Button, Input } from "@material-ui/core";
import React, { useState } from "react";
import { useStakeToken } from '../../hooks/useStakeToken';
import { utils } from "ethers";

export interface StakeFormProps {
    token: Token;
}


export const StakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token;
    const { account } = useEthers();
    const tokenBalance = useTokenBalance(tokenAddress, account);
    const formattedTokenBalance = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0;

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { approveAndStake, approveAndStakeErc20State } = useStakeToken(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }


    return (
        <>
            <Input onChange={handleInputChange} />
            <Button onClick={handleStakeSubmit} color="primary" size="large">STAKE</Button>
        </>
    )
}