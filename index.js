require("dotenv").config();
//console.log(process.env)
const request = require('request');
const util = require('util')
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
//---------Web3ContractConnect
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const myPrivateKeyHex = process.env.relayPK;
var providerURL = "https://api.avax-test.network/ext/bc/C/rpc";
let provider = new HDWalletProvider(myPrivateKeyHex, providerURL);
var web3 = new Web3(provider);

const myWallet = process.env.relayAddr;
const myBetWallet = process.env.betOwnerAddr;
var path = require("path");
const { exec } = require("child_process");
const { response } = require("express");
const { time } = require("console");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
const { Server } = require("socket.io");
const e = require("express");
const io = new Server(server);




app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Mint.html");
});

app.get("/AnuraGames/:gameRoom", (req, res) => {
  res.sendFile(__dirname + "/public/AnuraDice/gameroom.html");
});



app.get("/debug", (req, res) => {
  res.send("End of debug");
});


//AVAX DEPOSITED FOR BRIDGE--------------------------------------------
app.post("/AVAXReceived", async (req, res) => {
  console.log("AVAX Received from deposit " + req.body.hash);
  console.log(req.body);
  //-----------------------------------------------AVAXReceived
  adjustProvider("AVAX");
 await new web3.eth.Contract(
    [ { "inputs": [ { "internalType": "address", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_avaxDepositHash", "type": "bytes32" } ], "name": "AVAXRecieved", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_relay", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "bscDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "priceBSC", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "BridgedBSC", "type": "event" }, { "inputs": [ { "internalType": "address payable", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_bscDepositHash", "type": "bytes32" }, { "internalType": "int256", "name": "priceBSC", "type": "int256" } ], "name": "BSCBridged", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "rebalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "avaxDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "RecievedAVAX", "type": "event" }, { "inputs": [], "name": "avaxAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "bscDollarAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" } ] ,
    process.env.avaxBridgeAddr
  ).methods.AVAXRecieved(req.body.from_address,req.body.value,req.body.hash).send({from: myWallet, chainId: 43113}).then(console.log("AVAX RECEIVED FIRED")).catch(function (reason){
  console.log(reason);
    console.log("ERROR")});
  //-----------------------------------------------AVAXBridged
  var avaxPrice = parseFloat(req.body.avaxPrice) * 10**18;// Change Covalent price to proper decimals needed
  adjustProvider('BSC');
  await new web3.eth.Contract(
    [ { "inputs": [ { "internalType": "address payable", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_avaxDepositHash", "type": "bytes32" }, { "internalType": "int256", "name": "priceAVAX", "type": "int256" } ], "name": "AVAXBridged", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_bscDepositHash", "type": "bytes32" } ], "name": "BNBRecieved", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_relay", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "avaxDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "priceBSC", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "BridgedAVAX", "type": "event" }, { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "rebalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "bscDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "RecievedBNB", "type": "event" }, { "inputs": [], "name": "avaxDollarAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "bscAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" } ],
    process.env.bscBridgeAddr
  ).methods.AVAXBridged(req.body.from_address,req.body.value.toString(),req.body.hash,avaxPrice.toString()).send({from: myWallet, chainId:97}).then().catch(function (reason){
  console.log(reason);
    console.log("ERROR")});
    
    
    res.send("Request received")
});










//BSC DEPOSITED FOR BRIDGE--------------------------------------------
app.post("/BSCReceived", async (req, res) => {
  console.log("BSC Received from deposit " + req.body.hash);
  console.log(req.body);
//BNB Received
adjustProvider("BSC");
await new web3.eth.Contract([ { "inputs": [ { "internalType": "address payable", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_avaxDepositHash", "type": "bytes32" }, { "internalType": "int256", "name": "priceAVAX", "type": "int256" } ], "name": "AVAXBridged", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_bscDepositHash", "type": "bytes32" } ], "name": "BNBRecieved", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_relay", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "avaxDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "priceBSC", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "BridgedAVAX", "type": "event" }, { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "rebalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "bscDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "RecievedBNB", "type": "event" }, { "inputs": [], "name": "avaxDollarAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "bscAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" } ],
    process.env.bscBridgeAddr
  ).methods.BNBRecieved(req.body.from_address,req.body.value.toString(),req.body.hash).send({from: myWallet, chainId:97}).catch(function (reason){
  console.log(reason);
    console.log("ERROR")});

    console.log("About to fire off the BSC Bridged");
    var bscPrice = req.body.bscPrice * 10**18;// Change Covalent price to proper decimals needed
  //BNB Bridged
  adjustProvider("AVAX");
  console.log(bscPrice);
  await new web3.eth.Contract(
    [ { "inputs": [ { "internalType": "address", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_avaxDepositHash", "type": "bytes32" } ], "name": "AVAXRecieved", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_relay", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "bscDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "priceBSC", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "BridgedBSC", "type": "event" }, { "inputs": [ { "internalType": "address payable", "name": "_requester", "type": "address" }, { "internalType": "int256", "name": "_bridgedAmount", "type": "int256" }, { "internalType": "bytes32", "name": "_bscDepositHash", "type": "bytes32" }, { "internalType": "int256", "name": "priceBSC", "type": "int256" } ], "name": "BSCBridged", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "rebalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "requester", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "avaxDepositHash", "type": "bytes32" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "RecievedAVAX", "type": "event" }, { "inputs": [], "name": "avaxAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "bscDollarAMT", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" } ] ,
    process.env.avaxBridgeAddr
  ).methods.BSCBridged(req.body.from_address,req.body.value.toString(),req.body.hash,bscPrice.toString()).send({from: myWallet, chainId: 43113}).catch(function (reason){
  console.log(reason);
    console.log("ERROR")});
  res.send("Request received")
});


//Serverside Redemption, safemint is clientside
app.post("/redeemBond", async (req, res) =>{
  //console.log(req.body.nftId);
  adjustProvider(req.body.chain);
  if(req.body.chain == "BSC"){
    new web3.eth.Contract(
      [ { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint8", "name": "AVAXPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint8", "name": "BSCPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "Amount", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "price", "type": "int256" } ], "name": "BurnPayout", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "BondMap", "outputs": [ { "internalType": "address", "name": "bondholder", "type": "address" }, { "internalType": "uint8", "name": "percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "percentBSC", "type": "uint8" }, { "internalType": "uint256", "name": "blocktime", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "uint256", "name": "timeStamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "bondvariables", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestTimeStamp", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "payout", "type": "uint256" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "payoutBondRedemption", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "redeemBond", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint8", "name": "_percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "_percentBSC", "type": "uint8" } ], "name": "safeMint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "AVAXBridge", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ] ,
      process.env.bscBondAddr
    ).methods.BondMap(parseInt(req.body.nftId)).call().then(async function(payload){
      var amtInWei = 123;
      //amtInWei = calculatePayout('AVAX')
      console.log(payload);
      amtInWei = await calculatePayout("BSC",payload['percentAVAX'],payload['percentBSC'],payload['amount'],payload['price'],payload['timeStamp']);
      console.log(amtInWei);




      new web3.eth.Contract(
        [ { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint8", "name": "AVAXPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint8", "name": "BSCPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "Amount", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "price", "type": "int256" } ], "name": "BurnPayout", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "BondMap", "outputs": [ { "internalType": "address", "name": "bondholder", "type": "address" }, { "internalType": "uint8", "name": "percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "percentBSC", "type": "uint8" }, { "internalType": "uint256", "name": "blocktime", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "uint256", "name": "timeStamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "bondvariables", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestTimeStamp", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "payout", "type": "uint256" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "payoutBondRedemption", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "redeemBond", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint8", "name": "_percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "_percentBSC", "type": "uint8" } ], "name": "safeMint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "AVAXBridge", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ],
        process.env.bscBondAddr
      ).methods.payoutBondRedemption(payload['bondholder'],amtInWei.toString(),req.body.nftId).send({from: myWallet, chainId: 97}).then()

    }).catch(function (reason){
    console.log(reason)})


  }
  else if(req.body.chain == "AVAX"){
    new web3.eth.Contract(
[ { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint8", "name": "AVAXPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint8", "name": "BSCPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "Amount", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "price", "type": "int256" } ], "name": "BurnPayout", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "BondMap", "outputs": [ { "internalType": "address", "name": "bondholder", "type": "address" }, { "internalType": "uint8", "name": "percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "percentBSC", "type": "uint8" }, { "internalType": "uint256", "name": "blocktime", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "uint256", "name": "timeStamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "bondvariables", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestTimeStamp", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "payout", "type": "uint256" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "payoutBondRedemption", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "redeemBond", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint8", "name": "_percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "_percentBSC", "type": "uint8" } ], "name": "safeMint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "AVAXBridge", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ] ,
      process.env.avaxBondAddr
    ).methods.BondMap(parseInt(req.body.nftId)).call().then(async function(payload){
      console.log("Calculating AVAX Burn payout");
      amtInWei = await calculatePayout("AVAX",payload['percentAVAX'],payload['percentBSC'],payload['amount'],payload['price'],payload['timeStamp']);
      console.log(amtInWei);






      new web3.eth.Contract(
        [ { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint8", "name": "AVAXPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint8", "name": "BSCPayout", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "Amount", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "price", "type": "int256" } ], "name": "BurnPayout", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "BondMap", "outputs": [ { "internalType": "address", "name": "bondholder", "type": "address" }, { "internalType": "uint8", "name": "percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "percentBSC", "type": "uint8" }, { "internalType": "uint256", "name": "blocktime", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "uint256", "name": "timeStamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "bondvariables", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLatestTimeStamp", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "payout", "type": "uint256" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "payoutBondRedemption", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "redeemBond", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint8", "name": "_percentAVAX", "type": "uint8" }, { "internalType": "uint8", "name": "_percentBSC", "type": "uint8" } ], "name": "safeMint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "AVAXBridge", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ],
              process.env.avaxBondAddr
            ).methods.payoutBondRedemption(payload['bondholder'],amtInWei.toString(),req.body.nftId).send({from: myWallet, chainId: 43113}).then();

    }).catch(function (reason){
    console.log(reason);
      console.log("ERROR")});

  }



  

  res.send("Request received");
});



server.listen(3000, () => {
  console.log("listening on *:3000");
});


function adjustProvider(chain){
  if(chain == "BSC"){
  var providerURL = "https://speedy-nodes-nyc.moralis.io/ade357c5ddf5810bb15f5014/bsc/testnet";
  }
  if(chain == "AVAX"){
  var providerURL = "https://speedy-nodes-nyc.moralis.io/ade357c5ddf5810bb15f5014/avalanche/testnet";
  }
  provider = new HDWalletProvider(myPrivateKeyHex, providerURL);
  web3 = new Web3(provider);
}

async function calculatePayout(currency,percentAvax,percentBSC,amountDeposited,priceAtInvestmentTime,timeStamp){
   var amountInEther = amountDeposited / 10**18;
   priceAtInvestmentTime = priceAtInvestmentTime / 10**8;
    timeStamp = timeStamp - 50000;
   var initialInputValue = amountInEther * priceAtInvestmentTime; //This is the base currency
   var dayToQuery = new Date(timeStamp *1000);
   dayToQuery = dayToQuery.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  dayToQuery = dayToQuery.split(' ')[0];
  var finalPayout = 0;
  var spotPrices = await myRest("https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=AVAX,BNB&key=ckey_45d4ed8ecb8e4627ba137fe1d1d");
  spotPrices = JSON.parse(spotPrices);
  var bscCurrent = spotPrices.data.items[0].quote_rate;
  var avaxCurrent = spotPrices.data.items[1].quote_rate;
  console.log('BSC current - ' + bscCurrent + ' AVAX Current - ' + avaxCurrent);
  var paymentMatrix = {};
  paymentMatrix.avaxValueCurrent; //
  paymentMatrix.avaxValueHistorical = initialInputValue * (percentAvax/100); //value in avax on day 0
  paymentMatrix.bscValueHistorical = initialInputValue * (percentBSC/100); //value in BSC on day 0
  paymentMatrix.bscValueCurrent;


   if(currency == "AVAX"){
    //BSC Price Historical
    var bscHistorical = await myRest("https://api.covalenthq.com/v1/pricing/historical/USD/WBNB/?quote-currency=USD&format=JSON&from="+dayToQuery+"&to="+dayToQuery+"&key=ckey_45d4ed8ecb8e4627ba137fe1d1d")
    //console.log(bscHistorical);

    bscHistorical = JSON.parse(bscHistorical);
    bscHistorical = bscHistorical.data.prices[0].price;
    paymentMatrix.avaxValueCurrent = paymentMatrix.avaxValueHistorical*(avaxCurrent/priceAtInvestmentTime);
    paymentMatrix.bscValueCurrent = paymentMatrix.bscValueHistorical * (bscCurrent/bscHistorical);

    finalPayout = paymentMatrix.bscValueCurrent + paymentMatrix.avaxValueCurrent; //dollars
    finalPayout = (finalPayout/avaxCurrent) * 10**18


    
    }

   else if(currency == "BSC"){
   var avaxHistorical = await myRest("https://api.covalenthq.com/v1/pricing/historical/USD/AVAX/?quote-currency=USD&format=JSON&from="+dayToQuery+"&to="+dayToQuery+"&key=ckey_45d4ed8ecb8e4627ba137fe1d1d")
    console.log(avaxHistorical);
   avaxHistorical = JSON.parse(avaxHistorical);
  avaxHistorical = avaxHistorical.data.prices[0].price;

   paymentMatrix.avaxValueCurrent = paymentMatrix.avaxValueHistorical*(avaxCurrent/avaxHistorical);
   paymentMatrix.bscValueCurrent = paymentMatrix.bscValueHistorical * (bscCurrent/priceAtInvestmentTime);

   finalPayout = paymentMatrix.bscValueCurrent + paymentMatrix.avaxValueCurrent; //dollars
    finalPayout = (finalPayout/bscCurrent) *10**18
  }




console.log(paymentMatrix);

  return finalPayout

}


async function myRest(url){
  const requestPromise = util.promisify(request);
  const response = await requestPromise(url);
  return response.body
}


const gameRoom = new Map();
io.on("connection", socket => { 

  //GameRoomJoin
  socket.on("gameRoomJoin", (msg) => {
    console.log(socket.id + ' has joined ' + msg.room);
    socket.join(msg.room.toString());
    msg.players = socket.adapter.rooms.get(msg.room).size;
    if(msg.players == 1){
      msg.event = "Only one player is currently in the room";
      var player = {};
      player.wallet = msg.wallet;
      player.playerNumber = 1;
      player.id = socket.id;
      var gameObj = {};
      gameObj.playerNumActive = 1;
      gameObj.player1 = player;
      gameObj.player1Current = 0;
      gameObj.player2Current = 0;
      gameObj.player1Score = 0;
      gameObj.player2Score = 0;
      gameRoom.set(msg.room,gameObj)
    }
    if(msg.players == 2){
      msg.event = "Two players are currently in the room";
      msg.action = "startGame"
      gameObj = gameRoom.get(msg.room);
      var player = {};
      player.wallet = msg.wallet;
      player.playerNumber = 2;
      player.id = socket.id;
      gameObj.player2 = player;
      gameRoom.set(msg.room,gameObj);
    }
    var currRoom = msg.room.toString();
    msg = JSON.stringify(msg);
    console.log("Emitting a game room join event");
    io.to(currRoom).emit("gameRoomJoin", msg);
  });
//Bet
socket.on("bet", async (msg) => {
  //Check Moralis Server
  var result = await myRest("https://mb3i9xaqfbiq.usemoralis.com:2053/server/functions/getBets?_ApplicationId=2rYyHAOeeeqQ6AfX7xS9wlrdINe8WahHUqCdkfwM&roomID="+msg.room)
  msg.action = result;
  gameObj = gameRoom.get(msg.room);
  if(msg.action.indexOf('Both')!= -1){
    gameObj.playerNumActive = 1;
    gameRoom.set(msg.room,gameObj);
    console.log("Both Players bet, player 1 is about to start");
    console.log("Emitting a game room Activate UI");
    io.to(gameObj.player1.id).emit("activateUI")
  }
  console.log("Emitting a game room bet event");
  io.to(msg.room).emit("bet", msg);
});

socket.on("diceEvent", async function(msg){
  var game = gameRoom.get(msg.room);
  console.log(msg);
  if (msg.event == "rollDice") {
    var diceValue = Math.trunc(Math.random() * 6) + 1;
    console.log(game.playerNumActive + ' rolled a '+ diceValue);
    //If you roll a 1
    if (diceValue !== 1) {
      // Add dice to current score
      if (game.playerNumActive == 1) {
        game.player1Current += diceValue;
      }
      if (game.playerNumActive == 2) {
        game.player2Current += diceValue;
      }
    } else {
      if (game.playerNumActive == 1) {
        game.player1Current = 0;
        console.log(game.playerNumActive + ' is now active ');
        io.to(gameObj.player1.id).emit("deactivateUI")
        io.to(gameObj.player2.id).emit("activateUI")

      }
      if (game.playerNumActive == 2) {
        game.player2Current = 0;
        console.log(game.playerNumActive + ' is now active ');
        io.to(gameObj.player1.id).emit("activateUI")
        io.to(gameObj.player2.id).emit("deactivateUI")
      }

      if(game.playerNumActive == 1){
        game.playerNumActive = 2;
      }else{
        game.playerNumActive = 1;
      }
    }

    msg.diceValue = diceValue;
    gameRoom.set(msg.room,game);
    msg.gameDetails = game;
    io.to(msg.room).emit("diceEvent",msg);
  }



  if (msg.event == "lockInScore") {
    console.log("Hold was pressed by " + game.playerNumActive); 
    if (game.playerNumActive == 1) {
      game.player1Score += game.player1Current;
      game.player1Current = 0;
      msg.gameDetails = game;
      io.to(gameObj.player1.id).emit("deactivateUI");
      io.to(gameObj.player2.id).emit("activateUI");

    }
    if (game.playerNumActive == 2) {
      game.player2Score += game.player2Current;
      game.player2Current = 0;
      msg.gameDetails = game;
      io.to(gameObj.player1.id).emit("activateUI");
      io.to(gameObj.player2.id).emit("deactivateUI");

    }

    console.log("Hold was pressed, the prefinal is " + game.playerNumActive);
    if(game.playerNumActive == 1){
      game.playerNumActive = 2;
    }else{
      game.playerNumActive = 1;
    }
    console.log("Hold was pressed, the final decision is " + game.playerNumActive + ' is active now');
    gameRoom.set(msg.room,game);
    io.to(msg.room).emit("diceEvent",msg);

    //WIN LOGIC

    if (game.player1Score >= 100) {
      console.log("Player 1 Won");
      msg.status = "Player 1 Won, congrats, payment is on its way";
      msg.gameDetails = game;
      var payoutCurrency = await myRest("https://mb3i9xaqfbiq.usemoralis.com:2053/server/functions/determinebetRewardMedium?_ApplicationId=2rYyHAOeeeqQ6AfX7xS9wlrdINe8WahHUqCdkfwM");
      var spotPrices = await myRest("https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=AVAX,BNB&key=ckey_45d4ed8ecb8e4627ba137fe1d1d");
      spotPrices = JSON.parse(spotPrices);
      var bscCurrent = spotPrices.data.items[0].quote_rate;
      var avaxCurrent = spotPrices.data.items[1].quote_rate;      
      if(payoutCurrency.indexOf('A')!= -1){
        avaxCurrent = 9.9/avaxCurrent
        avaxCurrent = avaxCurrent * (10**18)
        adjustBetProvider('AVAX');
        new web3.eth.Contract(
          [ { "inputs": [ { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "bet", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "payee", "type": "address" }, { "internalType": "address", "name": "loser", "type": "address" }, { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "distributePrizes", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomID", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amtBet", "type": "uint256" } ], "name": "betSend", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "payee", "type": "address" }, { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }, { "indexed": false, "internalType": "uint32", "name": "roomID", "type": "uint32" } ], "name": "payNotification", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "bridgeWallet", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minimumBet", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ],
                "0xB6d816b5d7B896AF695412999ddAD9E0A4AB9b71"
              ).methods.distributePrizes(gameObj.player1.wallet,gameObj.player2.wallet,msg.room).send({from: myBetWallet, value:avaxCurrent.toString(), chainId: 43113})


        console.log('AVAX Payout' + avaxCurrent);
      }else{
        console.log('BNB');
        bscCurrent = 9.9/bscCurrent
        bscCurrent = bscCurrent * (10**18)
        console.log('BNB Payout' + bscCurrent);
        adjustBetProvider('BSC')
        new web3.eth.Contract(
          [ { "inputs": [ { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "bet", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "payee", "type": "address" }, { "internalType": "address", "name": "loser", "type": "address" }, { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "distributePrizes", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomID", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amtBet", "type": "uint256" } ], "name": "betSend", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "payee", "type": "address" }, { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }, { "indexed": false, "internalType": "uint32", "name": "roomID", "type": "uint32" } ], "name": "payNotification", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "bridgeWallet", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minimumBet", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ],
                "0x8E57C7a580F1a688DE8b6ba4A621f03068E218BD"
              ).methods.distributePrizes(gameObj.player1.wallet,gameObj.player2.wallet,msg.room).send({from: myBetWallet, value:bscCurrent.toString(), chainId: 97})
      }


      io.to(msg.room).emit("gameOver",msg)
      io.to(gameObj.player2.id).emit("deactivateUI")
      io.to(gameObj.player1.id).emit("deactivateUI")
    }
    if (game.player2Score >= 100) {
      console.log("Player 2 Won");
      msg.status = "Player 2 Won, congrats, payment is on its way";
      msg.gameDetails = game;
      var payoutCurrency = await myRest("https://mb3i9xaqfbiq.usemoralis.com:2053/server/functions/determinebetRewardMedium?_ApplicationId=2rYyHAOeeeqQ6AfX7xS9wlrdINe8WahHUqCdkfwM");
      var spotPrices = await myRest("https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=AVAX,BNB&key=ckey_45d4ed8ecb8e4627ba137fe1d1d");
      spotPrices = JSON.parse(spotPrices);
      var bscCurrent = spotPrices.data.items[0].quote_rate;
      var avaxCurrent = spotPrices.data.items[1].quote_rate;      
      if(payoutCurrency.indexOf('A')!= -1){
        avaxCurrent = 9.9/avaxCurrent
        avaxCurrent = avaxCurrent * (10**18)
      
        adjustBetProvider('AVAX');
        new web3.eth.Contract(
          [ { "inputs": [ { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "bet", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "payee", "type": "address" }, { "internalType": "address", "name": "loser", "type": "address" }, { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "distributePrizes", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomID", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amtBet", "type": "uint256" } ], "name": "betSend", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "payee", "type": "address" }, { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }, { "indexed": false, "internalType": "uint32", "name": "roomID", "type": "uint32" } ], "name": "payNotification", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "bridgeWallet", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minimumBet", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ],
                "0xB6d816b5d7B896AF695412999ddAD9E0A4AB9b71"
              ).methods.distributePrizes(gameObj.player2.wallet,gameObj.player1.wallet,msg.room).send({from: myBetWallet, value:avaxCurrent.toString(), chainId: 43113})

        console.log('AVAX Payout' + avaxCurrent);
      }else{
        console.log('BNB');
        bscCurrent = 9.9/bscCurrent
        bscCurrent = bscCurrent * (10**18)
        console.log('BNB Payout' + bscCurrent);

        adjustBetProvider('BSC');
        new web3.eth.Contract(
          [ { "inputs": [ { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "bet", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "payee", "type": "address" }, { "internalType": "address", "name": "loser", "type": "address" }, { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "distributePrizes", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomID", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amtBet", "type": "uint256" } ], "name": "betSend", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "payee", "type": "address" }, { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }, { "indexed": false, "internalType": "uint32", "name": "roomID", "type": "uint32" } ], "name": "payNotification", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "bridgeWallet", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minimumBet", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ],
                "0x8E57C7a580F1a688DE8b6ba4A621f03068E218BD"
              ).methods.distributePrizes(gameObj.player2.wallet,gameObj.player1.wallet,msg.room).send({from: myBetWallet, value:bscCurrent.toString(), chainId: 97})


      }


      io.to(msg.room).emit("gameOver",msg)
      io.to(gameObj.player2.id).emit("deactivateUI")
      io.to(gameObj.player1.id).emit("deactivateUI")
    }
  }
})
  
});

function adjustBetProvider(chain){

  if(chain == "BSC"){
    var providerURL = "https://speedy-nodes-nyc.moralis.io/ade357c5ddf5810bb15f5014/bsc/testnet";
    }
    if(chain == "AVAX"){
    var providerURL = "https://speedy-nodes-nyc.moralis.io/ade357c5ddf5810bb15f5014/avalanche/testnet";
    }
    provider = new HDWalletProvider(process.env.betOwnerPK, providerURL);
    web3 = new Web3(provider);
   
}