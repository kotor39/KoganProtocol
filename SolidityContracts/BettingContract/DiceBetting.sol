//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiceCrossChainBetting is Ownable {
   int public minimumBet;
   AggregatorV3Interface internal priceFeed;
   int baseCurrencyInDollar;
   int weiCurrencyIn1Dollar;
   int ratio;
    /**
     * Network: AVAX TESTNET
     * Aggregator: AVAX/USD
     * Address: 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
     */

    event betSend(address sender, uint roomID, uint amtBet);
    event payNotification(address payee, address loser, uint32 roomID);
   
   
  constructor(address baseCurrency) {
      priceFeed = AggregatorV3Interface(baseCurrency);

    }


function bet(uint32 _roomID) public payable {
      //Peg minimumBet to always be x of y currency via chainlink
      updateMinimumBet();
      baseCurrencyInDollar = (minimumBet/10**8);  // How many Dollars 1 whole base Currency is worth
     minimumBet = (((10**18)*5)/baseCurrencyInDollar); //This is roughly the amount our value needs to be but because it's 0.137

      if(int(msg.value) < minimumBet){
      revert();
      }
      emit betSend(msg.sender,_roomID,msg.value);

}
    // Generates a number between 1 and 10 that will be the winner
    function distributePrizes(address payable payee, address loser, uint32 _roomID) public payable onlyOwner {
          emit payNotification(payee,loser,_roomID);
          payee.transfer(msg.value);
      }


      function sweepToBridge(address payable bridgeWallet) external payable onlyOwner {
            bridgeWallet.transfer(address(this).balance-(1 ether));
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

 function updateMinimumBet() private {
        minimumBet = getLatestPrice();
    }





}