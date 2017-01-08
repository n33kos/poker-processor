//---------------tests.js---------------
//--------------------------------------

var poker = require('../poker');

function assert(condition, message) {
    if (!condition) {
        return "**Fail** - " + message;
    }else{
    	return "Pass - " + message;
    }
}

function make_deck () {
	var deck = [];
	for (var i = 2; i < 15; i++) {
		for (var j = 0; j < 4; j++) {
			var suit = "C"
			if(j==1){
				suit = "D";
			}else if(j==2){
				suit = "H";
			}else if(j==3){
				suit = "S";
			}
			deck.push(i+suit);
		}
	}
	return deck;
}

function unit_tests() {
	console.log('\n----------------------------------------------');
	
	//-----Validate Input
	var test_inputs = {
		"valid": "2H KD 4S 6S AD 2H 2S 4H 6D 6H",
		"toomany": "2H KD 4S 6S AD 2H 2S 4H 6D 6H TS",
		"alphanum": "2H K} 4S 6S $D 2H 2. 4H 6D 6H",
	};
	console.log(
		assert(poker.validate_input(test_inputs.valid) == true, 
		"validate_input: Return true if valid") 
	);
	console.log(
		assert(poker.validate_input(test_inputs.toomany) == false, 
		"validate_input: Return false if character count is incorrect") 
	);
	console.log(
		assert(poker.validate_input(test_inputs.alphanum) == false, 
		"validate_input: Return false if non-alphanumeric") 
	);

	var go = poker.make_gameobject(test_inputs.valid);
	console.log(
		assert(typeof go == "object" && typeof go.black == "object" && typeof go.white == "object", 
		"make_gameobject: gameobject is an object containing black and white objects") 
	);

	//-----Hand Rank
	var testRank = poker.rank_hand("AS 2H TC AH 3S");
	console.log(
		assert( ( typeof testRank == "object" && typeof testRank.ranks == 'object' && typeof testRank.highs == 'object' && typeof testRank.face == 'object' && typeof testRank.suit == 'object'),
		"rank_hand: Return object containing ranks, highs, face, and suit arrays") 
	);
	var thing = poker.rank_hand("AS 2H TC AH 3S");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 0,
		"rank_hand: Pair Has A Rank Of 0") 
	);
	thing = poker.rank_hand("AS 2H 3C 2C 3S");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 1,
		"rank_hand: Two Pair Has A Rank Of 1") 
	);
	thing = poker.rank_hand("AS AH 3C 2C AS");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 2,
		"rank_hand: Three of a Kind Has A Rank Of 2") 
	);
	thing = poker.rank_hand("8S 9H TC JC QS");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 3,
		"rank_hand: Straight Has A Rank Of 3") 
	);
	thing = poker.rank_hand("8H 2H TH 4H 7H");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 4,
		"rank_hand: Flush Has A Rank Of 4") 
	);
	thing = poker.rank_hand("AS AH 5C AS 5D");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 5,
		"rank_hand: Full House Has A Rank Of 5") 
	);
	thing = poker.rank_hand("AS AH AC AD 2S");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 6,
		"rank_hand: Four of a Kind Has A Rank Of 6") 
	);
	thing = poker.rank_hand("2H 3H 4H 5H 6H");
	console.log(
		assert(thing.ranks[thing.ranks.length-1]  == 7,
		"rank_hand: Straight Flush Has A Rank Of 7") 
	);

	//------Highest Card
	console.log(
		assert( poker.highest_card('TD9D7S9HKH') == 13,
		"highest_card: Static test should return 13")
	 );
	console.log(
		assert( poker.highest_card('TH6DTDAH7C') == 14,
		"highest_card: Static test should return 14")
	 );
	console.log(
		assert( poker.highest_card('6STC4C9C7S') == 10,
		"highest_card: Static test should return 10")
	 );
	console.log(
		assert( poker.highest_card('3C4S3D2H3D') == 4,
		"highest_card: Static test should return 4")
	 );
	console.log(
		assert( poker.highest_card('2H7H2C3D2D') == 7,
		"highest_card: Static test should return 7")
	 );

	//-----Winning Hand
	console.log(
		assert(poker.winning_hand(poker.make_gameobject("2H 3D 5S 9C KD 2C 3H 4S 8C AH")) == "White Wins.",
		"winning_hand: Static Test 1 Returns White Wins.") 
	);
	console.log(
		assert(poker.winning_hand(poker.make_gameobject("2H 4S 4C 2D 4H 2S 8S AS QS 3S")) == "Black Wins.",
		"winning_hand: Static Test 2 Returns Black Wins.") 
	);
	console.log(
		assert(poker.winning_hand(poker.make_gameobject("2H 3D 5S 9C KD 2C 3H 4S 8C KH")) == "Black Wins.",
		"winning_hand: Static Test 3 Returns Black Wins.") 
	);
	console.log(
		assert(poker.winning_hand(poker.make_gameobject("2H 3D 5S 9C KD 2D 3H 5C 9S KH")) == "Tie.",
		"winning_hand: Static Test 4 Returns Tie.") 
	);

	//-----Random Hands
	console.log("\n5 Random Hands: ");
	for (var j = 0; j < 5; j++) {
		var deck = make_deck();
		var randomHands = "";
		for (var i = 0; i < 10; i++) {
			var card = deck.splice(Math.floor(Math.random()*deck.length), 1).join("");
			card = card.replace(/(10|11|12|13|14)/g, function(n){var t={10:'T',11:'J',12:'Q',13:'K',14:'A'};return t[n];})+" ";
			randomHands += card;
		}
		console.log("Black: "+randomHands.substring(0,15));
		console.log("White: "+randomHands.substring(15));
		console.log(poker.winning_hand(poker.make_gameobject(randomHands)));
	}

	console.log("----------------------------------------------\n");
}
unit_tests();