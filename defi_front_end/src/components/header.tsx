import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core";
// import { useTokenBalance } from "../hooks/useTotalTokenBalance";
// import { formatUnits } from "ethers/lib/utils";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    }
}))


export const Header = () => {
    const classes = useStyles();
    const { account, activateBrowserWallet, deactivate } = useEthers();
    const isConnected = account !== undefined;
    const shownAccount = account?.substring(0, 5) + "...." + account?.substring(account.length - 3, account.length)
    // const tokenBalance = useTokenBalance()
    // const userTotalBalance: number = tokenBalance
    //     ? parseFloat(formatUnits(tokenBalance, 18))
    //     : 0
    return (
        <>
            <div className={classes.container}>
                <div>
                    {isConnected ?
                        <Button color="primary" variant="contained">{shownAccount}</Button> :
                        <div></div>}
                </div>
                <div>
                    {isConnected ?
                        <Button color="primary" variant="contained" onClick={deactivate}> Disconnect </Button> :
                        (<Button color="primary" variant="contained" onClick={() => activateBrowserWallet()}> Connect </Button>)}
                </div>
                {/* <div>
                    <Button variant="contained">Total token value: ${userTotalBalance}</Button>
                </div> */}
            </div>
        </>
    )
}