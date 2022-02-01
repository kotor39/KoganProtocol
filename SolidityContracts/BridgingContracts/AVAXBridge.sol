// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;


import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract AVAXBridge {


    address relay;
    int priceAVAX;
    int public bscDollarAMT;
    int public avaxAMT;
    AggregatorV3Interface internal priceFeed;

    event RecievedAVAX(address indexed requester, bytes32 indexed avaxDepositHash, int amount, uint timestamp);
    event BridgedBSC (address indexed requester, bytes32 indexed bscDepositHash, int amount, int priceBSC, uint timestamp);

    constructor (address _relay) {
        relay = _relay;
        priceFeed = AggregatorV3Interface(0x5498BB86BC934c8D34FDA08E81D444153d0D06aD); //AVAX TESTNET CHAINLINK CONTRACT
    }
    
    function deposit() public payable{}

    function AVAXRecieved (address _requester, int _bridgedAmount, bytes32 _avaxDepositHash) onlyRelay external {
        emit RecievedAVAX(_requester, _avaxDepositHash, _bridgedAmount, block.timestamp);
    }

    function BSCBridged (address payable _requester, int _bridgedAmount, bytes32 _bscDepositHash, int priceBSC) onlyRelay external {
        emit BridgedBSC(_requester, _bscDepositHash, _bridgedAmount, priceBSC, block.timestamp);
        priceAVAX = getLatestPrice();
        bscDollarAMT = priceBSC * _bridgedAmount; 
        avaxAMT = bscDollarAMT / (priceAVAX*(10**10));
        _requester.transfer(uint(avaxAMT));    
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

    function rebalance (address payable to, uint256 amount) public onlyRelay {
        to.transfer(amount);
    }


    modifier onlyRelay {
      require(msg.sender == relay, "only relay can execute this function");
      _;
    }
}