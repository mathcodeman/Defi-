import { Token } from "../main"
import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import React, { useState } from "react"
import { UnStake } from "./UnStake"


interface Props {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(5),
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))


export const TokenFarm = ({ supportedTokens }: Props) => {
    const [selectedToken, setSelectedToken] = useState(0)

    const handleChange = (e: React.FormEvent<{}>, newValue: string) => {
        setSelectedToken(parseInt(newValue))
    }

    const classes = useStyles();
    return (
        <>
            <Box>
                <h1 className={classes.header}>The TokenFarm Contract</h1>
                <Box className={classes.box}>
                    <TabContext value={selectedToken.toString()}>
                        <TabList onChange={handleChange} aria-label="stake form tabs">
                            {supportedTokens.map((token, index) => {
                                return <Tab label={token.name} value={index.toString()} key={index} />
                            })}
                        </TabList>
                        {supportedTokens.map((token, index) => {
                            return (
                                <TabPanel value={index.toString()} key={index.toString()}>
                                    <div className={classes.tabContent}>
                                        <UnStake token={supportedTokens[selectedToken]} />
                                    </div>
                                </TabPanel>)
                        })}
                    </TabContext>
                </Box>
            </Box>
        </>
    )
}