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

class messageBlock extends Block{
	constructor(index, timestamp, data, previousHash = '') {
		super(index, timestamp, data, previousHash = '');
		
	}
	
}

class voteBlock extends Block{
	constructor(index, timestamp, data, previousHash = '') {
		super(index, timestamp, data, previousHash = '');
		
	}
	
}

class Blockchain{
	
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 1
				
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
	
	printMessageForURL(url){
		var chain = this
		this.chain.forEach(function(block){					
			if(block.data.url_hash == url){
				var polarity = chain.get_polarity(block.index);
				console.log(block.data.user + ": " + block.data.message + "\n" + "Polarity: " + polarity);
			}
		});
	}
	
	get_polarity(block_index){
		var polarity = 0;
		this.chain.forEach(function(block){
			if(block.data.block_id == block_index){
				polarity = polarity + block.data.polarity;
			}
		});
		return polarity;
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

ossmCoin = new Blockchain();

//two comment blocks
ossmCoin.addBlock(new messageBlock(1,"01/01/2018",{url_hash:'123', user: "user123AAC", message: "And its like that, and thats the way it is - HUWAH!", timestamp: "13:37", polarity : 0}));
ossmCoin.addBlock(new messageBlock(2,"01/01/2018",{url_hash:'123', user: "user456ABB", message: "To infinity and eat pies!", timestamp: "22:16", polarity : 0}));
//positive vote
ossmCoin.addBlock(new voteBlock(3,"01/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.addBlock(new voteBlock(4,"02/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.addBlock(new voteBlock(5,"03/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.addBlock(new voteBlock(6,"04/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
ossmCoin.addBlock(new voteBlock(7,"05/01/2018",{block_id: 1, user: "user123AAC", message: "I agree with you!", timestamp: "16:20", polarity: 1}));
//negative vote
ossmCoin.addBlock(new voteBlock(8,"06/01/2018",{block_id: 2, user: "user123AAC", message: "Damn it you're wrong!", timestamp: "03:16", polarity: -1}));
ossmCoin.addBlock(new voteBlock(9,"07/01/2018",{block_id: 2, user: "user123AAC", message: "Damn it you're wrong!", timestamp: "03:16", polarity: -1}));
ossmCoin.addBlock(new voteBlock(10,"08/01/2018",{block_id: 2, user: "user123AAC", message: "Damn it you're wrong!", timestamp: "03:16", polarity: -1}));
//reply without vote
ossmCoin.addBlock(new voteBlock(11,"01/01/2018",{block_id: 2, user: "user123AAC", message: "I am on the fence about this!", timestamp: "03:16", polarity : 0}));

ossmCoin.printMessageForURL('123');
//console.log(JSON.stringify(ossmCoin, null, 4));



