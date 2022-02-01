
var socket = io();


// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnBet = document.getElementById('betButton');



let scores, currentScore, activePlayer, playing

// Starting conditions
const init = function () {

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  currentScore = 0;
  scores = [0,0];
  activePlayer = 0;
  
  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');

  console.log('New Game Started');
  playing = true;
};
init();





var gameRoom = window.location.pathname.split('/')[2];
document.getElementById('roomID').innerText = "Welcome to Room : " + gameRoom;

var msg = {};


ethereum.enable().then(function(){
  msg.room = gameRoom;
  var wallet = ethereum.selectedAddress;
  msg.wallet = wallet;
   socket.emit('gameRoomJoin',msg);
});

socket.on('gameRoomJoin', function(msg) { 
  console.log("I received a join notificate");
  msg = JSON.parse(msg);
  console.log("Join Message Received");

  console.log(msg);
  if(msg.action == 'startGame'){
    btnBet.style.display ='BLOCK';
  }
})



btnBet.addEventListener('click', async function () {
  if (playing) {
    btnBet.style.display = "NONE";
      var callerWallet =  web3.currentProvider.selectedAddress;
      var chain = web3.currentProvider.chainId;
      var gameRoom = window.location.pathname.split('/')[2];
      if(chain == "0xa869"){
        var contractAddr = "0xB6d816b5d7B896AF695412999ddAD9E0A4AB9b71"
      }
      if(chain == "0x61"){
        var contractAddr = "0x8E57C7a580F1a688DE8b6ba4A621f03068E218BD"
      }
              var lp = await new window.web3.eth.Contract([ { "inputs": [ { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "bet", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "payee", "type": "address" }, { "internalType": "address", "name": "loser", "type": "address" }, { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "distributePrizes", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomID", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amtBet", "type": "uint256" } ], "name": "betSend", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "payee", "type": "address" }, { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }, { "indexed": false, "internalType": "uint32", "name": "roomID", "type": "uint32" } ], "name": "payNotification", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "bridgeWallet", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minimumBet", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ],contractAddr).methods.getLatestPrice().call();
              lp = lp / 10**8; // $ amt in USD of 1 token
              lp = 5.05/lp //1% Buffer
              lp = lp*(10**18);
              console.log(lp);
              await new window.web3.eth.Contract([ { "inputs": [ { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "bet", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "payee", "type": "address" }, { "internalType": "address", "name": "loser", "type": "address" }, { "internalType": "uint32", "name": "_roomID", "type": "uint32" } ], "name": "distributePrizes", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "baseCurrency", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomID", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amtBet", "type": "uint256" } ], "name": "betSend", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "payee", "type": "address" }, { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }, { "indexed": false, "internalType": "uint32", "name": "roomID", "type": "uint32" } ], "name": "payNotification", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "bridgeWallet", "type": "address" } ], "name": "sweepToBridge", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getLatestPrice", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minimumBet", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ],contractAddr).methods.bet(parseInt(gameRoom)).send({from: callerWallet, value: lp}).then(function(result){});
              var msg = {};
              msg.wallet = callerWallet;
              msg.room = gameRoom;
              socket.emit('bet',msg)

            }});


socket.on('bet', function(msg) { 
              console.log("Bet Received");
              console.log(msg);
              msg.action = JSON.parse(msg.action).result;
              if(msg.action == 'Both Bets Found'){
              }
            })
  
socket.on('activateUI',function(msg){
  console.log("Received a UI activation");
  btnRoll.style.display ="BLOCK";
  btnHold.style.display = "BLOCK";
})

socket.on('deactivateUI',function(msg){
  console.log("Received a UI deactivation");
  btnRoll.style.display ="NONE";
  btnHold.style.display = "NONE";
})

socket.on('gameOver',function(msg){
   //Display Winner
   document.getElementById('rollButton').style.display='NONE';
   document.getElementById('holdButton').style.display='NONE';
   document.getElementById('betButton').style.display='NONE';
   alert(msg.status);
 })


 btnRoll.addEventListener('click', async function () {
diceEvent("rollDice");

 })

 btnHold.addEventListener('click', async function () {
  diceEvent("lockInScore");
  document.getElementById('rollButton').style.display='NONE';
  document.getElementById('holdButton').style.display='NONE';
   })

function diceEvent(button){
  var msg ={};
  msg.event = button;
  msg.room = window.location.pathname.split('/')[2];
  var callerWallet =  web3.currentProvider.selectedAddress;
  msg.wallet = callerWallet;
  console.log("firing an event");
  socket.emit('diceEvent',msg);
}





socket.on('diceEvent',function(msg){
  console.log(msg); 
  if(msg.diceValue){
  var dice = msg.diceValue;
  diceEl.classList.remove('hidden');
  diceEl.src = `/AnuraDice/GameFiles/dice-${dice}.png`;   
  }
  document.getElementById('current--0').innerText = msg.gameDetails.player1Current;
  document.getElementById('current--1').innerText = msg.gameDetails.player2Current;
  document.getElementById('score--0').innerText = msg.gameDetails.player1Score;
  document.getElementById('score--1').innerText = msg.gameDetails.player2Score;
})
/*


  // Ensure the player whose bet went through is checked and also hide the bet button after bet goes through
  if(msg.event == 'playerBet'){
    document.getElementsByClassName('name ' + msg.callerNFT)[0].innerText = msg.callerNFT +' ✔️';
      if(self == msg.callerNFT){
        document.getElementById('betButton').style.display = 'NONE';
      }
    }

//Display the graphic of the Dice Roll
  if(msg.event == 'rollDice'){
    var dice = msg.diceValue;
    diceEl.classList.remove('hidden');
    diceEl.src = `/AnuraDice/GameFiles/dice-${dice}.png`;   
  }





//Ensure Scores are Updated after every event


});

*/

