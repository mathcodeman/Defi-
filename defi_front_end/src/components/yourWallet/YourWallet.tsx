import { Token } from "../main"
import React, { useState } from "react"
import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { WalletBalance } from "./WalletBalance"
import { StakeForm } from "./StakeForm"
import { useEthers } from "@usedapp/core"
import { ConnectionMsg } from "../connectionMsg"


interface YourWalletProps {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(5)
    },
    tabContentStart: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(100)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))


export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const classess = useStyles();
    const { account } = useEthers();
    const [selectedToken, setSelectTokenIndex] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectTokenIndex(parseInt(newValue))
    }

    const isConnected = account !== undefined;
    return (
        <>
            <Box>
                <h1 className={classess.header}> Your Wallet </h1>
                {isConnected ?
                    <Box className={classess.box}>
                        <TabContext value={selectedToken.toString()}>
                            <TabList onChange={handleChange} aria-label="stake form tabs">
                                {supportedTokens.map((token, index) => {
                                    return (
                                        <Tab label={token.name} value={index.toString()} key={index} />
                                    )
                                })}
                            </TabList>
                            {supportedTokens.map((token, index) => {
                                return (
                                    <TabPanel value={index.toString()} key={index}>
                                        <div className={classess.tabContent}>
                                            <WalletBalance token={supportedTokens[selectedToken]} />
                                            <StakeForm token={supportedTokens[selectedToken]} />
                                        </div>
                                    </TabPanel>
                                )
                            })}
                        </TabContext>
                    </Box>
                    :
                    <ConnectionMsg />
                }
            </Box>

        </>
    )
}