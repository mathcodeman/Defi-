import { Token } from "../main";
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
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
    const { notifications } = useNotifications()

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { approveAndStake, approveAndStakeErc20State, stakeState } = useStakeToken(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeErc20State.status === "Mining" || stakeState.status === "Mining"
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false)
    const handleChange = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokenSuccess(false)
    }
    useEffect(() => {
        if (notifications.filter((notification) => notification.type === "transactionSucceed" && notification.transactionName === "Approve ERC20 transfer").length > 0) {
            console.log("Approved!!")
            setShowErc20ApprovalSuccess(true)
            setShowStakeTokenSuccess(false)
        }
        if (notifications.filter((notification) => notification.type === "transactionSucceed" && notification.transactionName === "Staked Token!!").length > 0) {
            console.log("Token Staked!!")
            setShowErc20ApprovalSuccess(false)
            setShowStakeTokenSuccess(true)
        }
    }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess])


    return (
        <>
            <div>
                <Input onChange={handleInputChange} />
                <Button onClick={handleStakeSubmit} color="primary" size="large" disabled={isMining}>{isMining ? <CircularProgress size={26} /> : "STAKE!!!"}</Button>
            </div>
            <Snackbar open={showErc20ApprovalSuccess} autoHideDuration={6000} onClose={handleChange}>
                <Alert onClose={handleChange} severity="success">
                    ERC-20 token transfer approved!! Now approve the 2nd transaction.
                </Alert>
            </Snackbar>
            <Snackbar open={showStakeTokenSuccess} autoHideDuration={6000} onClose={handleChange}>
                <Alert onClose={handleChange} severity="success">
                    Token Staked!!
                </Alert>
            </Snackbar>
        </>
    )
}