from brownie import accounts, network, config, Contract, MockV3Aggregator, WethToken, FauToken, LinkToken
from web3 import Web3


FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]


def get_account(index=None, id=None):
    # accounts[0]
    # accounts.add("env")
    # accounts.load("id")
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "weth_token": WethToken,
    "fau_token": FauToken,
    "link_token": LinkToken,
}

DECIMALS = 18
INITIAL_VALUE = Web3.toWei(2000, "ether")


def get_contract(contract_name):
    # This function will grab the contract address from the brownie config if defined, otherwise it will deploy a mock version of that contract and return that mock contract.#
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            # MockV3Aggregator.length
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active(
        )][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi)
    return contract


def deploy_mocks(decimals=DECIMALS, initial_value=INITIAL_VALUE):
    """
    Use this script if you want to deploy mocks to a testnet
    """
    print(f"The active network is {network.show_active()}")

    print("Deploying Mocks...")
    account = get_account()
    print("Deploying Mock Link Token...")
    link_token = LinkToken.deploy({"from": account})

    print("Deploying Mocks...")
    account = get_account()
    print("Deploying Fau Token...")
    fau_token = FauToken.deploy({"from": account})
    print(f"Deployed to {fau_token.address}!!")

    print("Deploying Mocks...")
    account = get_account()
    print("Deploying Weth Token...")
    weth_token = WethToken.deploy({"from": account})
    print(f"Deployed to {weth_token.address}!!")

    print("Deploying Mocks...")
    account = get_account()
    print("Deploying V3Agg...")
    price_feed = MockV3Aggregator.deploy(
        decimals, initial_value, {"from": account})
    print(f"Deployed to {price_feed.address}!!")


def fund_with_link(
    contract_address, account=None, link_token=None, amount=Web3.toWei(0.3, "ether")
):
    account = account if account else get_account()
    link_token = link_token if link_token else get_contract("link_token")
    # Keep this line to show how it could be done without deploying a mock
    # tx = interface.LinkTokenInterface(link_token.address).transfer(
    #     contract_address, amount, {"from": account}
    # )
    tx = link_token.transfer(contract_address, amount, {"from": account})
    print("Funded {}".format(contract_address))
    return tx
