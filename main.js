const SHA256 = require('./node_modules/crypto-js/sha256')

class Block{
	
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calc_hash();
		this.nonce = 0;
		
	}
	
	calc_hash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}
	
	mineBlock(difficulty){
		while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calc_hash();
		}	
		console.log("Block mined: " + this.hash);
	}

	
}

class Blockchain{
	
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 40
				
	}

	createGenesisBlock(){
		return new Block(0,"01/01/2018","Make it so", "0");
	}
	
	getLatestBlock(){
		return this.chain[this.chain.length -1];
	}
	
	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		newBlock.hash = newBlock.calc_hash();
		this.chain.push(newBlock);
		
	}
	
	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			
			if(currentBlock.hash !== currentBlock.calc_hash()){
				return false;
			}
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		return true;
	}
}


let ossmCoin = new Blockchain();
ossmCoin.addBlock(new Block(1,"01/01/2018",{url_hash:'', user: "user123AAC", message: "And its like that, and thats the way it is - HUWAH!", timestamp: "13:37", votes: 0}));
ossmCoin.addBlock(new Block(2,"01/01/2018",{url_hash:'', user: "user456ABB", message: "To infinity and eat pies!", timestamp: "22:16", votes: 0}));
ossmCoin.addBlock(new Block(4,"01/01/2018",{url_hash:'', momauser: "user654BAA", message: "If up is down and down is up, which way is that?", timestamp: "16:20", votes: 0}));
ossmCoin.addBlock(new Block(3,"01/01/2018",{url_hash:'', user: "user123AAB", message: "He who has the last laugh, laughs last!", timestamp: "03:16", votes: 0}));


console.log(JSON.stringify(ossmCoin, null, 4));

