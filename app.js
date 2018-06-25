const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx');
const contract = require('./contract')
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"))
const myContract = new web3.eth.Contract(contract.abi, contract.address)

const PublicKey = "0xbe862AD9AbFe6f22BCb087716c7D89a26051f74C"
const PrivateKey = "0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109"

// Update the message value for new message
const message = 'Coffee Lake'

const data = myContract.methods.updateMessage(message).encodeABI()

web3.eth.getTransactionCount(PublicKey, (error, nonce) => {

  const formatedPrivateKey = PrivateKey.substring(2);
  const privateKey = Buffer.from(formatedPrivateKey, 'hex')

  const txParams = {
    nonce: nonce,
    gasPrice: 1e9,
    gasLimit: 1e6,
    to: contract.address,
    value: 0,
    data: data
  }

  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const signedTX = "0x" + tx.serialize().toString('hex')
  
  web3.eth.sendSignedTransaction(signedTX).on('receipt', (receipt) => {
    // this will only print after the confirmation
    console.log(receipt.transactionHash)
  })

})
