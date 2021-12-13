// SPDX-License-Identifier: MIT
// stakeToken checked!
// unStakeToken
// issueTokens checked!
// addAllowedTokens checked!
// getEthValue checked!

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // list of allowed tokens for staking
    address[] public allowedTokens;
    // mapping token address => staker address => amount to keep track how much of each token each staker stake
    mapping(address => mapping(address => uint256)) public stakingBalance;
    // keep track the stakers who stake in different tokens
    mapping(address => uint256) public uniqueTokensStaked;
    // keep track the stakers address
    address[] public stakers;
    // mapping of price feed contract address to allowed staking tokens
    mapping(address => address) public tokenPriceFeedMapping;
    IERC20 public dappToken;

    // ERC20 token contract
    constructor(address _dappTokenAddress) public {
        dappToken = IERC20(_dappTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function issueToken() public onlyOwner {
        for (
            uint256 stakerIndex = 0;
            stakerIndex < stakers.length;
            stakerIndex++
        ) {
            address recipient = stakers[stakerIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            // send them a token reward based on their total value locked
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] > 0, "No tokens staked!!");
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(
                    _user,
                    allowedTokens[allowedTokensIndex]
                );
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        //1 ETH -> $4000, assert it returns $4000
        //1 DAI -> $1, assert it returns $1
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }
        // return price of the token ==> call getTokenValue() * stakingBalance[_token][user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        // THis is going to be the specific token value of the user has
        return ((stakingBalance[_token][_user] * price) / (10**decimals));
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        //Price feed address
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function stakeToken(uint256 _amount, address _token) public {
        // What token can they stake? checked
        // How much can they stake? checked
        require(_amount > 0, "Amount must be more than 0");
        require(tokenIsAllowed(_token), "Token is in allowed!!");
        // Need to use transferFrom function(from, to, value) since the TokenFarm does not own the ERC20 tokens
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        // Update token balance of user
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unStakeToken(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staking balance cannot be zero");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
    }

    // Keep track how many tokens the staker been staked in this farm
    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (
            uint256 allowedTokenIndex = 0;
            allowedTokenIndex < allowedTokens.length;
            allowedTokenIndex++
        ) {
            if (allowedTokens[allowedTokenIndex] == _token) {
                return true;
            }
        }
        return false;
    }
}
