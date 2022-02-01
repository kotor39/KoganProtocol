const logger = Moralis.Cloud.getLogger(); 

const web3AVAX = Moralis.web3ByChain("0xa869"); //AVAX testnet
const web3BSC =  Moralis.web3ByChain("0x61"); //BSC testnet
const bscBridgeAddress = "0x31f15683e48fE8D006e511F24972782d9ECdF36b"; 
const avaxBridgeAddress = "0xa4e123D866807CCA4736691fbe53795B5d8e7193";
const relayAddress = "0xb1040c22a6d30a7D40453D12552f99fa605e60B1"; 
const bscBridgeABI = '[{"inputs":[{"internalType":"address","name":"_relay","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"requester","type":"address"},{"indexed":true,"internalType":"bytes32","name":"avaxDepositHash","type":"bytes32"},{"indexed":false,"internalType":"int256","name":"amount","type":"int256"},{"indexed":false,"internalType":"int256","name":"priceBSC","type":"int256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"BridgedAVAX","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"requester","type":"address"},{"indexed":true,"internalType":"bytes32","name":"bscDepositHash","type":"bytes32"},{"indexed":false,"internalType":"int256","name":"amount","type":"int256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"RecievedBNB","type":"event"},{"inputs":[{"internalType":"address payable","name":"_requester","type":"address"},{"internalType":"int256","name":"_bridgedAmount","type":"int256"},{"internalType":"bytes32","name":"_avaxDepositHash","type":"bytes32"},{"internalType":"int256","name":"priceAVAX","type":"int256"}],"name":"AVAXBridged","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_requester","type":"address"},{"internalType":"int256","name":"_bridgedAmount","type":"int256"},{"internalType":"bytes32","name":"_bscDepositHash","type":"bytes32"}],"name":"BNBRecieved","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"avaxDollarAMT","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bscAMT","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getLatestPrice","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rebalance","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
const avaxBridgeABI = '[{"inputs":[{ "internalType": "address", "name": "_relay", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "bscDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "priceBSC", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "BridgedBSC", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "avaxDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "RecievedAVAX", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_avaxDepositHash", "type": "bytes32" } ], "name": "AVAXRecieved", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_bscDepositHash", "type": "bytes32" }, { "internalType": "int256", "name": "priceBSC", "type": "int256" } ], "name": "BSCBridged", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "avaxAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "bscDollarAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "rebalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]';
const bscBridge =  new web3BSC.eth.Contract(JSON.parse(bscBridgeABI),bscBridgeAddress); 
const avaxBridge = new web3AVAX.eth.Contract(JSON.parse(avaxBridgeABI), avaxBridgeAddress);
  

  

// code example of creating a sync event from cloud code 

let avaxOptions = { 

    "chainId": "0xa869", //AVAX Testnet 

    "address": "0xB6d816b5d7B896AF695412999ddAD9E0A4AB9b71", 

    "topic": "betSend(address, uint, uint)", //event with types 

    "abi":  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"roomID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amtBet","type":"uint256"}],"name":"betSend","type":"event"}, 

    "tableName": "AVAXSentBets", 

    "sync_historical": false 

} 

Moralis.Cloud.run("watchContractEvent", avaxOptions, {useMasterKey:true}); 

let bscOptions = { 

    "chainId": "0x61", //BSCTestnet 

    "address": "0x8E57C7a580F1a688DE8b6ba4A621f03068E218BD", 

    "topic": "betSend(address, uint, uint)", //event with types 

    "abi":  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"roomID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amtBet","type":"uint256"}],"name":"betSend","type":"event"}, 

    "tableName": "BSCSentBet", 

    "sync_historical": false 

} 

Moralis.Cloud.run("watchContractEvent", bscOptions, {useMasterKey:true}); 

  

  

Moralis.Cloud.afterSave("AVAXSentBets", (request) => { 

    const avaxConfirmed = request.object.get("confirmed"); 

  if(avaxConfirmed == false){ 

   const avaxSentBetData = JSON.parse(JSON.stringify(request.object, ["transaction_hash","block_hash","roomID","block_timestamp"])); //Put The params you want to extract here 

  logger.info(" Log 1 - " + avaxSentBetData.roomID) 

logger.info("Hi A bet was received in AVAX"); 

findComparativeBet(avaxSentBetData.roomID); 

  } 

}) 

  

  

Moralis.Cloud.afterSave("BSCSentBet", (request) => { 

  const bscConfirmed = request.object.get("confirmed"); 

if(bscConfirmed == false){ 

   const bscSentBetData = JSON.parse(JSON.stringify(request.object, ["transaction_hash","block_hash","roomID","block_timestamp"])); //Put The params you want to extract here 

  logger.info(" Log 1 - " + bscSentBetData.roomID) 

logger.info("Hi A bet was received in BSC"); 

  findComparativeBet(bscSentBetData.roomID); 

    } 

}) 

async function findComparativeBet (roomID){ 

// create query 

var  bscQuery = new Moralis.Query("BSCSentBet"); 

var  avaxQuery = new Moralis.Query("AVAXSentBets"); 

bscQuery.equalTo("roomID", roomID); // sample query 

avaxQuery.equalTo("roomID", roomID); 

  const bscResults = await bscQuery.find(); 

  const avaxResults = await avaxQuery.find(); 

    logger.info("BSC -" + JSON.stringify(bscResults)); 

  logger.info("AVAX -" + JSON.stringify(avaxResults)); 

      //HERE IS WHERE WE'D HAVE CODE TO COUNT for rooms in the past hour.....not sure if we'll get around to this, we'll assume random 

  var countBets = 0; 

  countBets = bscResults.length; 

  countBets = countBets + avaxResults.length; 

  //if so, execute a contract to confirm play 

  var gameStatus = 'No Bets'; 

  if(countBets == 1){ 

   gameStatus = "One Bet Found";  

  } 

  if(countBets >= 2){ 

     gameStatus = "Both Bets Found"; 

  } 

   

  return gameStatus; 

} 

Moralis.Cloud.define("returnGameStatus", (request) => { 

var res = findComparativeBet(request.params.roomID); 

return res 

}); 

  

Moralis.Cloud.define("determinebetRewardMedium", async (request) => {  //Bug Bounty Capitalization of endpoint matters but auto reverts? 

  var largestTreasury = "NA"; 

  var bscTransactionalBalance = await getWalletBalance("97",bscOptions.address); 

  bscTransactionalBalance = bscTransactionalBalance.data.data.items[0].balance 

  var avaxTransactionalBalance = await getWalletBalance("43113",avaxOptions.address); 

  avaxTransactionalBalance = avaxTransactionalBalance.data.data.items[0].balance; 

  var priceDetails = await getPrices(); 

  var valueBNB = (bscTransactionalBalance/(10**18))*priceDetails.data.data.items[0].quote_rate; 

  var valueAVAX = (avaxTransactionalBalance/(10**18))*priceDetails.data.data.items[1].quote_rate; 

  if(valueAVAX > valueBNB){ 

   largestTreasury = "AVAX";  

  }else{ 

    largestTreasury = "BNB" 

  } 

  return largestTreasury 

}) 

  

async function getWalletBalance(chain,address){   

   return await Moralis.Cloud.httpRequest({ 

  url: 'https://api.covalenthq.com/v1/'+chain+'/address/'+address+'/balances_v2/?key=ckey_45d4ed8ecb8e4627ba137fe1d1d' 

}).then(function(httpResponse) { 

  logger.info("Heres your wallet balance for " + address + " on chain " + chain); 

     return httpResponse 

  }) 

} 

async function getPrices(){ 

return await Moralis.Cloud.httpRequest({ 

         url: "https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=AVAX,BNB&key=ckey_45d4ed8ecb8e4627ba137fe1d1d" 

       }).then(function(httpResponse){  

return httpResponse 

}) 

}







Moralis.Cloud.afterSave("BscTransactions", async (request) => { 
    logger.info("We noticed a BSC transaction"); 
    const depositBscData = JSON.parse(JSON.stringify(request.object, ["from_address", "value", "hash", "confirmed", "to_address"]));
    const bscDepositConfirmed = request.object.get("confirmed"); 
    var priceDetails = await getPrices(); 
  	depositBscData.bscPrice = priceDetails.data.data.items[0].quote_rate;
  	logger.info("About to Check if It's confirmed and value > 0 and address is equal to locale lower case");
  	logger.info(bscDepositConfirmed);
  	logger.info(depositBscData['value']);
  	logger.info(depositBscData['to_address']);
    if(bscDepositConfirmed == true && depositBscData['value'] > 0 && depositBscData['to_address'] == bscBridgeAddress.toLocaleLowerCase()){ 
        //CALL NGROK
      logger.info('Calling BSC Received on NGROK');
      Moralis.Cloud.httpRequest({
  		method: 'POST',
  		url: 'http://5db8-74-194-173-113.ngrok.io/BSCReceived',
  		body: depositBscData
}).then(function(httpResponse) {
  logger.info(httpResponse.text);
}, function(httpResponse) {
  logger.info('Request failed with response code ' + httpResponse.status);
});
      
      
      
  } 
    else{
        logger.info("BSC transaction was not a confirmed bridge transaction, deeper inspection ongoing");
      	logger.info(JSON.stringify(request));
    }
})



Moralis.Cloud.afterSave("AvaxTransactions", async (request) => { 
    logger.info("We noticed an AVAX transaction"); 
    const depositAvaxData = JSON.parse(JSON.stringify(request.object, ["from_address", "value", "hash", "confirmed","to_address"]));
    const avaxDepositConfirmed = request.object.get("confirmed"); 
    var priceDetails = await getPrices(); 
  	depositAvaxData.avaxPrice = priceDetails.data.data.items[1].quote_rate;
    if(avaxDepositConfirmed == true && depositAvaxData['value'] > 0 && depositAvaxData['to_address'] == avaxBridgeAddress.toLocaleLowerCase()){ 
        //CALL NGROK
      //Call AVAX Recieved
      Moralis.Cloud.httpRequest({
  		method: 'POST',
  		url: 'http://5db8-74-194-173-113.ngrok.io/AVAXReceived',
  		body: depositAvaxData
}).then(function(httpResponse) {
  logger.info(httpResponse.text);
}, function(httpResponse) {
  logger.info('Request failed with response code ' + httpResponse.status);
});   
  } 
    else{
        logger.info("Avax Bridge confirmed is not true. Deeper Payload inspection");
      	var reqPayload = JSON.parse(JSON.stringify(request.object,['tokenId']));
      	if(reqPayload.tokenId){
         logger.info("Token ID was found in the payload " + reqPayload.tokenId);
        }
    }
})




var bscBurnedOptions = { 

    "chainId": "0x61", //BSCTestnet 

    "address": "0x0123aBeb925Be0ad700ce3444B393Eff3C0B498D", 

    "topic": "BurnPayout(uint8, uint8, uint256, int);", //event with types 

    "abi":  JSON.parse('{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"AVAXPayout","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"BSCPayout","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"Amount","type":"uint256"},{"indexed":false,"internalType":"int256","name":"price","type":"int256"}],"name":"BurnPayout","type":"event"}'),
	
  	"tableName": "BSCRedemption", 

    "sync_historical": false 

} 

Moralis.Cloud.run("watchContractEvent", bscBurnedOptions, {useMasterKey:true}); 


Moralis.Cloud.define("getBets", (request) => {
  var res = findComparativeBet(request.params.roomID);
  
return res
});
