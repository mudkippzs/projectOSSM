/***
OSSM Blockchain
@author: Alex Sheridan (mudkippzs@gmail.com)
github: https://github.com/mudkippzs/projectOSSM

A messaging platform built on a block chain.

Proof of Concept Conclussions
- Its possible to store structured content inside a block
- Its possible to use community-vote to enable an intellectual economy
- Its possible to ensure complete anonymity and 100% incorruptability and transparency

Future Work
- Client app
-- Broadcast to other clients

***/

// Needs node js module crypto-js.
const SHA256 = require('./node_modules/crypto-js/sha256')


/***
Main block class.

Describes the basic functions and attributes of a block

***/
class Block{
	
	constructor(timestamp, transactions, data, previousHash = ''){
		this.index = this.generate_index; // index is required for voteing as a relational index
		this.timestamp = timestamp;
		this.data = data;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calc_hash();
		this.nonce = 0;
		
	}
	
	// Hash is generated with SHA256(block index + previous hash + timestamp + jsonString(data[]) + nonce)
	calc_hash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}
	
	// Mine the block and get the tasty ossmCoin from within!
	mineBlock(difficulty){
		while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calc_hash();
		}	
		console.log("Block mined: " + this.hash);
	}
	
	generate_index() {
	  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	  )
	}

	
}

// A subclass of a Block for posting messages to the network
class messageBlock extends Block{
	constructor(timestamp, data, previousHash = '') {
		super(timestamp, data, previousHash = '');
		
	}
	
}

// A subclass of a Block for posting votes to the network
class voteBlock extends Block{
	constructor(timestamp, data, previousHash = '') {
		super(timestamp, data, previousHash = '');
		
	}
	
}

class Transaction{
	
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
	
}


// The OSSM chain is the network where all blocks live
class Blockchain{
	
	/***
	function constructor	
	**/
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 3; // Adjust to increase time to get a block @todo: write something to make this grow!
		this.pendingTransactions = [];
		this.miningReward = 100;
	}
	/***
	function createGenesisBlock
	@return : the first block in the chain is created
	**/
	createGenesisBlock(){
		return new Block("01/01/2018",[],"Make it so", "0"); // "'With great power comes great responsability' - Uncle Ben" - Michael Scott
	}
	
	/***
	function getLatestBlock 
	@return : previous block added in the chain
	**/
	getLatestBlock(){
		return this.chain[this.chain.length -1];
	}
	
	/***
	function addBlock
	@param newBlock : block to add to chain
	
	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		newBlock.hash = newBlock.calc_hash();
		this.chain.push(newBlock);
		
	}
	**/
	
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions,'nothing', this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
	
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);		
	}
	
	getBalanceOfAddress(address){
		let balance = 0;

		for(const block of this.chain){
			
			for(const trans of block.transactions){								
				if(trans.fromAddress === address){
					console.log('From: ' + trans.fromAddress);
					balance -= trans.amount;
				}

				if(trans.toAddress === address){
					console.log('To: ' + trans.toAddress);
					balance += trans.amount;
				}
			}
		}

		return balance;
	}
	
	/***
	function printMessageForURL
	@param url : url to filter blocks for
	Outputs the messages from blocks on the chain which match the url hash and include meta data
	**/
	printMessageForURL(url){
		var chain = this
		this.chain.forEach(function(block){					
			if(block.data.url_hash == url){
				var polarity = chain.get_polarity(block.index);
				console.log(block.data.user + ": " + block.data.message + "\n" + "Polarity: " + polarity);
			}
		});
	}
	
	/***
	function get_polarity
	@param message_block_index : the index of the block whos polarity to calculate
	Returns the net polarity by counting all vote_blocks corrosponding to this message_block_index
	**/
	get_polarity(message_block_index){
		var polarity = 0;
		this.chain.forEach(function(vote_block){
			if(vote_block.data.block_id == message_block_index){
				polarity = polarity + vote_block.data.polarity;
			}
		});
		return polarity;
	}	
	
	/***
	function isChainValid
	Verifies the intergity of the chain
	**/
	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			
			if(currentBlock.hash !== currentBlock.calc_hash()){
				console.log("Block integrity failure!");
				return false;
			}
			if(currentBlock.previousHash !== previousBlock.hash){
				console.log("Block integrity failure!");
				return false;
			}
		}
		console.log("Block integrity consistant!");
		return true;
	}
}

let ossmCoin = new Blockchain();

ossmCoin.createTransaction(new Transaction('address1', 'address2', 100));
ossmCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
ossmCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', ossmCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
ossmCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', ossmCoin.getBalanceOfAddress('xaviers-address'));
/* 
//two comment blocks
ossmCoin.addBlock(new messageBlock(1,"01/01/2018",{url_hash:'123', user: "user123AAC", message: "And its like that, and thats the way it is - HUWAH!", timestamp: "13:37", polarity : 0}));
ossmCoin.addBlock(new messageBlock(2,"01/01/2018",{url_hash:'123', user: "user456ABB", message: "To infinity and eat pies!", timestamp: "22:16", polarity : 0}));
//positive vote
ossmCoin.addBlock(new voteBlock(3,"01/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.isChainValid();
ossmCoin.addBlock(new voteBlock(4,"02/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.addBlock(new voteBlock(5,"03/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.addBlock(new voteBlock(6,"04/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.addBlock(new voteBlock(7,"05/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
//negative vote
ossmCoin.addBlock(new voteBlock(8,"06/01/2018",{block_id: 2, user: "user123AAC", message: "Damn it you're wrong!", timestamp: "03:16", polarity: -1}));
ossmCoin.addBlock(new voteBlock(9,"07/01/2018",{block_id: 2, user: "user123AAC", message: "Damn it you're wrong!", timestamp: "03:16", polarity: -1}));
ossmCoin.addBlock(new voteBlock(10,"08/01/2018",{block_id: 2, user: "user123AAC", message: "Damn it you're wrong!", timestamp: "03:16", polarity: -1}));
//reply without vote
ossmCoin.isChainValid();
ossmCoin.addBlock(new voteBlock(11,"01/01/2018",{block_id: 2, user: "user123AAC", message: "I am on the fence about this!", timestamp: "03:16", polarity : 0}));

ossmCoin.printMessageForURL('123');
//console.log(JSON.stringify(ossmCoin, null, 4));
 */


