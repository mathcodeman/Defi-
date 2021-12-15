from brownie import TokenFarm, DappToken, network, config
from web3 import Web3
from scripts.helpful import get_account, get_contract
import yaml
import json
import os
import shutil

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_tokenFarm_and_dappToken(font_end_update=False):
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
    if font_end_update:
        update_front_end()
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


# update_front_end() and copy_folders_to_front_end() are connecting point to the front end
def update_front_end():
    # Send the build folder
    copy_folders_to_front_end("./build", "../defi_front_end/src/chain-info")
    # Sending the front end our config in JSON format
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("../defi_front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated!!")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_tokenFarm_and_dappToken(font_end_update=True)
