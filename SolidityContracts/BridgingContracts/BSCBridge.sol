// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;


import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract BSCBridge {


    address relay;
    int priceBSC;
    int public avaxDollarAMT;
    int public bscAMT;
    AggregatorV3Interface internal priceFeed;

    event RecievedBNB(address indexed requester, bytes32 indexed bscDepositHash, int amount, uint timestamp);
    event BridgedAVAX (address indexed requester, bytes32 indexed avaxDepositHash, int amount, int priceBSC, uint timestamp);

    constructor (address _relay) {
        relay = _relay;
        priceFeed = AggregatorV3Interface(0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526); //BNB/USD TESTNET CHAINLINK CONTRACT
    }
    
    function deposit() public payable{}

    function BNBRecieved (address _requester, int _bridgedAmount, bytes32 _bscDepositHash) onlyRelay external payable {
        emit RecievedBNB(_requester, _bscDepositHash, _bridgedAmount, block.timestamp);
    }

    function AVAXBridged (address payable _requester, int _bridgedAmount, bytes32 _avaxDepositHash, int priceAVAX) onlyRelay external {
        emit BridgedAVAX(_requester, _avaxDepositHash, _bridgedAmount, priceAVAX, block.timestamp);
        priceBSC = getLatestPrice();
        avaxDollarAMT = priceAVAX* _bridgedAmount; 
        bscAMT = avaxDollarAMT / (priceBSC*(10**10));
        _requester.transfer(uint(bscAMT));    
    }
      
      function rebalance (address payable to, uint256 amount) external onlyRelay {
        to.transfer(amount);
    }

    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }


    modifier onlyRelay {
      require(msg.sender == relay, "only gateway can execute this function");
      _;
    }
}