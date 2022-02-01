
         async function loadWeb3() {
            if (window.ethereum) {
              window.web3 = new Web3(window.ethereum);
              window.ethereum.enable();
            }
          }
              async function load() {
              await loadWeb3();
              window.contract = await loadContract();
            } 

            async function loadContract() {
                return await new window.web3.eth.Contract([
                  {
                    "constant": true,
                    "inputs": [
                      {
                        "name": "player",
                        "type": "address"
                      }
                    ],
                    "name": "checkPlayerExists",
                    "outputs": [
                      {
                        "name": "",
                        "type": "bool"
                      }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "constant": false,
                    "inputs": [],
                    "name": "kill",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                  },
                  {
                    "constant": true,
                    "inputs": [
                      {
                        "name": "playerAddr",
                        "type": "address"
                      },
                      {
                        "name": "gameRoom",
                        "type": "uint256"
                      }
                    ],
                    "name": "checkPlayerBet",
                    "outputs": [
                      {
                        "name": "",
                        "type": "bool"
                      }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "constant": false,
                    "inputs": [
                      {
                        "name": "devWallet",
                        "type": "address"
                      }
                    ],
                    "name": "payDevs",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                  },
                  {
                    "constant": false,
                    "inputs": [],
                    "name": "clearPlayerArray",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                  },
                  {
                    "constant": false,
                    "inputs": [
                      {
                        "name": "playerWinner",
                        "type": "uint16"
                      },
                      {
                        "name": "playerLoser",
                        "type": "uint16"
                      },
                      {
                        "name": "_gameID",
                        "type": "uint32"
                      }
                    ],
                    "name": "distributePrizes",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                  },
                  {
                    "constant": true,
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                      {
                        "name": "",
                        "type": "address"
                      }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "constant": false,
                    "inputs": [
                      {
                        "name": "_playerSelected",
                        "type": "uint16"
                      },
                      {
                        "name": "_roomID",
                        "type": "uint32"
                      }
                    ],
                    "name": "bet",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                  },
                  {
                    "constant": true,
                    "inputs": [],
                    "name": "minimumBet",
                    "outputs": [
                      {
                        "name": "",
                        "type": "uint256"
                      }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "constant": false,
                    "inputs": [
                      {
                        "name": "playerAddr",
                        "type": "address"
                      }
                    ],
                    "name": "clearGameInfoOfPlayer",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                  },
                  {
                    "constant": true,
                    "inputs": [
                      {
                        "name": "",
                        "type": "address"
                      },
                      {
                        "name": "",
                        "type": "uint256"
                      }
                    ],
                    "name": "playerInfo",
                    "outputs": [
                      {
                        "name": "amountBet",
                        "type": "uint256"
                      },
                      {
                        "name": "playerSelected",
                        "type": "uint256"
                      },
                      {
                        "name": "roomID",
                        "type": "uint32"
                      }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "constant": true,
                    "inputs": [
                      {
                        "name": "",
                        "type": "uint256"
                      }
                    ],
                    "name": "players",
                    "outputs": [
                      {
                        "name": "",
                        "type": "address"
                      }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "inputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                  },
                  {
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "fallback"
                  }
                ],"0x318FF9e121506A108eaC73D02866d0b84793Fe60");}
            
	async function getCurrentAccount() {
        const accounts = await window.web3.eth.getAccounts();
        return accounts[0];
    }
        
    load(); 

	async function bet(callerWallet,callerNFT) {
        const account = await getCurrentAccount();
        var room = window.location.pathname.split('/')[2];
        const playerbet = window.contract.methods.bet(parseInt(callerNFT),room).send({from: account, value: 50000000000000000}).then(function(result){
          var msg = {};
          msg.event="playerBet";
          msg.room = window.location.pathname.split('/')[2];
          msg.callerNFT = callerNFT;
          msg.callerWallet = callerWallet;
          socket.emit('AnuraDiceEvent', JSON.stringify(msg));
        
        
        
        
        
        });
      }
      
