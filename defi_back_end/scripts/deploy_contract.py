from brownie import TokenFarm, DappToken, network, config
from web3 import Web3
from scripts.helpful import get_account, get_contract

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_tokenFarm_and_dappToken():
    account = get_account()
    dappToken = DappToken.deploy({"from": account})
    tokenFarm = TokenFarm.deploy(dappToken.address, {
                                 "from": account}, publish_source=config["networks"][network.show_active()]["verify"])
    tx = dappToken.transfer(
        tokenFarm.address, dappToken.totalSupply() - KEPT_BALANCE, {"from": account})
    tx.wait(1)
    # DappToken, WethToken, FauToken(DAI)
    wethToken = get_contract("weth_token")
    fauToken = get_contract("fau_token")
    dict_of_allowed_tokens = {
        dappToken: get_contract("dai_usd_price_feed"),
        fauToken: get_contract("dai_usd_price_feed"),
        wethToken: get_contract("eth_usd_price_feed")
    }
    add_allowed_tokens(tokenFarm, dict_of_allowed_tokens, account)
    return tokenFarm, dappToken


def add_allowed_tokens(token_farm_contract, dict_of_allowed_tokens, account):
    # {ETH:ETH.address, DAI:DAI.address, ...}
    for token, token_price_feed in dict_of_allowed_tokens.items():
        add_tx1 = token_farm_contract.setPriceFeedContract(
            token.address, token_price_feed.address, {"from": account})
        add_tx1.wait(1)
        add_tx2 = token_farm_contract.addAllowedTokens(
            token.address, {"from": account})
        add_tx2.wait(1)
    return token_farm_contract


def main():
    deploy_tokenFarm_and_dappToken()
