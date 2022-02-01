async function load(){

    if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
          }
  }

  load(); 