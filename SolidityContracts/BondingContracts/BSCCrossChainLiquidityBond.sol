// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
 
contract BSCCrossChainLiquidityBond is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 [] public bondvariables;
    mapping(uint256 => BV) public BondMap;
    AggregatorV3Interface internal priceFeed;

    event BurnPayout(uint8 AVAXPayout, uint8 BSCPayout, uint256 Amount, int price);
 
    constructor(address baseCurrency) ERC721("CrossChainLiquidityBonds", "CCLB") {
    priceFeed = AggregatorV3Interface(baseCurrency);
    }
    //0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526 BNB
    //0x5498BB86BC934c8D34FDA08E81D444153d0D06aD AVAX
 
    struct BV {
        address bondholder;
        uint8 percentAVAX;
        uint8 percentBSC;
        uint256 blocktime;
        uint256 amount;
        int price;
        uint timeStamp;
    }
 
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmVN9MRMmjS6EKwwUQxEMFhyrDN3pKtH9sXTyXTG8EpcCa/";
    }
 
    function safeMint(address to, uint8 _percentAVAX, uint8 _percentBSC) public payable {
        int dollarValue;
        uint timeStamp;
        uint256 NFTID;
        uint256 tokenId = _tokenIdCounter.current();
        require(_percentAVAX + _percentBSC == 100);
        timeStamp = getLatestTimeStamp();
        BondMap[tokenId].bondholder = to; 
        BondMap[tokenId].percentAVAX = _percentAVAX; 
        BondMap[tokenId].percentBSC = _percentBSC;
        BondMap[tokenId].blocktime = block.timestamp;
        BondMap[tokenId].amount = (msg.value);
        BondMap[tokenId].timeStamp = timeStamp;
        dollarValue = getLatestPrice();
        BondMap[tokenId].price = dollarValue;
        NFTID = tokenId;
        require(msg.value > 0 && dollarValue > 0);
        bondvariables.push(NFTID);
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
     
     function redeemBond(uint256 tokenId) public {
        uint256 NFTID;
        uint8 AVAXPayout;
        uint8 BSCPayout;
        uint256 Amount;
        int Price;
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        AVAXPayout= BondMap[tokenId].percentAVAX;
        BSCPayout = BondMap[tokenId].percentBSC;  
        Amount= BondMap[tokenId].amount;
        Price = BondMap[tokenId].price;
        NFTID = tokenId;
        emit BurnPayout(AVAXPayout, BSCPayout, Amount, Price);
    }

    function payoutBondRedemption(address payable to, uint256 payout, uint256 tokenId) external onlyOwner {
        uint256 NFTID;
        to.transfer(payout);
        NFTID = tokenId;
        delete bondvariables[NFTID];
        delete BondMap[tokenId];
        _burn(tokenId);
    }

    function sweepToBridge(address payable AVAXBridge) external onlyOwner {
        uint256 drop = address(this).balance; 
        AVAXBridge.transfer(drop);
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

    function getLatestTimeStamp() public view returns (uint) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return timeStamp;
    }
}