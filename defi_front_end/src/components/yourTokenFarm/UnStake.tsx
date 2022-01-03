import { Token } from "../main"
import { Button, CircularProgress } from "@material-ui/core"
import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../../chain-info/contracts/TokenFarm.json"
import networkMapping from "../../chain-info/deployments/map.json"
import { constants, utils, Contract } from "ethers";
import { useStakingBalance } from "../../hooks/useStakingBalance"
import { useTokenBalance } from "../../hooks/useTotalTokenBalance"
import { formatUnits } from "ethers/lib/utils";

interface Prop {
    token: Token
}

export const UnStake = ({ token }: Prop) => {
    //For Token Farm Contract
    const { chainId } = useEthers();
    const { abi } = TokenFarm;
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const balance = useStakingBalance(token.address)

    const value = useTokenBalance(token.address)

    const formattedBalance: number = balance
        ? parseFloat(formatUnits(balance, 18))
        : 0

    const formattedValue: number = value
        ? parseFloat(formatUnits(value, 18))
        : 0



    const isBalanceZero = formattedBalance === 0;

    const { send: UnStakeToken, state: UnStakeTokenState } = useContractFunction(tokenFarmContract, "unStakeToken", { transactionName: "Unstake Token" })

    const handleUnstake = () => {
        UnStakeToken(token.address)
    }

    const isUnStaking = UnStakeTokenState.status === "Mining";
    return (
        <>
            <div>
                <h4>Your staking balance is: {formattedBalance} (${formattedValue})</h4>
            </div>
            <div>
                {isUnStaking ?
                    <CircularProgress size={26} /> :
                    <Button onClick={handleUnstake} disabled={isBalanceZero} variant="contained" color="primary" >Unstake All {token.name}</Button>}
            </div>
        </>
    )
}