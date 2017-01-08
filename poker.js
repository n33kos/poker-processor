/**
 * poker.js - Process and generate poker hands.
 *
 * Usage: node poker.js tests/sampleinput.txt
 *
 */
 
module.exports = {
	
	fs: require('fs'),
	value_table : {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"T":10,"J":11,"Q":12,"K":13,"A":14},

	make_gameobject: function (str) {
		str = str.replace(/\s/g, '');
		var hands = [str.substring(0,10), str.substring(10)];
		return {
			'black': {'hand':hands[0], 'ranked':this.rank_hand(hands[0])},
			'white': {'hand':hands[1], 'ranked':this.rank_hand(hands[1])}
		};
	},

	validate_input: function (str) {
		str = str.replace(/\s/g, '');
		var match = String(str.match(/[a-zA-Z1-9]+/));
		return (match && match.length == 20);
	},

	rank_hand: function (hand) {
		var ranks = [-1];
		var highs = [this.highest_card(hand)];

		//---------Duplicates-------
		var face = hand.match(/[2-9TJQKA]/g).sort();
		var face_match = face.join("").match(/(.)\1+/g);
		if (face_match && face_match.length == 1) {
			if (face_match[0].length == 2) {
				ranks.push(0); // 0 - Pair
			}else if (face_match[0].length == 3) {
				ranks.push(2); // 2 - Three of a kind
			}else if (face_match[0].length == 4) {
				ranks.push(6); // 6 - Four of a kind
			}
			highs.push(this.highest_card(face_match[0]));
		}
		if (face_match && face_match.length == 2) {
			if (face_match[0].length == 2 && face_match[1].length == 2) {
				ranks.push(1); // 1 - Two Pair
				var h1 = this.highest_card(face_match[0]), h2 = this.highest_card(face_match[1]);
				highs.push(h1 > h2 ? h1 : h2);
			}else if (face_match[0].length + face_match[1].length == 5) {
				ranks.push(5); // 5 - Full House
				highs.push(this.highest_card(hand));
			}
		}

		//---------Consecutives--------
		var mod = this;
		for (var i = 0; i < face.length; i++) {
			face[i] = face[i].replace(/[TJQKA]/g, function(s){return mod.value_table[s];});
		}
		face = face.sort(function (a, b) {return a - b;})
		for (var i = 0; i < face.length; i++) {
			if (i == 4){
				ranks.push(3);// 3 - Straight
				var isStraight = true;
				highs.push(this.highest_card(hand));
			}
			if( face[i+1] != parseInt(face[i])+1)
				break;
		}

		//--------Suits--------
		var suit = hand.match(/[CDHS]/g).sort().join("");
		var suit = suit.match(/(.)\1+/g);
		if (suit && suit.length == 1 && suit[0].length == 5) {
			if(isStraight){
				ranks.push(7); // 7 - Straight Flush
			}else{
				ranks.push(4); // 4 - Flush
			}
			highs.push(this.highest_card(hand));
		}

		return {'ranks':ranks, 'highs':highs, 'face':face, 'suit':suit};
	},

	highest_card: function(hand) {
		var highest = 0;
		var hand = hand.replace(/[CDHS]/g, "");
		for (var i = 0; i < hand.length; i++) {
			highest = this.value_table[hand[i]] > highest ? this.value_table[hand[i]] : highest;
		}
		return highest;
	},

	winning_hand: function(gameObj) {
		var b = gameObj.black.ranked;
		var w = gameObj.white.ranked;

		for (var i = b.ranks.length - 1; i >= 0; i--) {
			if( b.ranks[i] > w.ranks[i] ){
				return "Black Wins.";
			}else if ( b.ranks[i] < w.ranks[i] ){
				return "White Wins.";
			}else{
				for (var j = b.highs.length - 1; j >= 0; j--) {
					if( b.highs[j] > w.highs[j] ){
						return "Black Wins.";
					}else if ( b.highs[j] < w.highs[j] ){
						return "White Wins.";
					}else{
						var hand_b = b.face.sort(function (a, b) {return b - a});
						var hand_w = w.face.sort(function (a, b) {return b - a});
						for (var k = 0; k < b.face.length; k++) {
							if( hand_b[k] > hand_w[k] ){
								return "Black Wins.";
							}else if( hand_b[k] < hand_w[k] ){
								return "White Wins.";
							}
						}
						if (i == 0 && j == 0)
						return "Tie.";
					}
				}
			}
		}
	},

	make_deck: function() {
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
	},

	draw_hands: function(deck) {
		var randomHands = "";
		for (var i = 0; i < 10; i++) {
			var card = deck.splice(Math.floor(Math.random()*deck.length), 1).join("");
			card = card.replace(/(10|11|12|13|14)/g, function(n){var t={10:'T',11:'J',12:'Q',13:'K',14:'A'};return t[n];})+" ";
			randomHands += card;
		}
		return randomHands;
	}
};

process.argv.forEach(function (val, index, array) {
	if( index == 2 ){
		var fs = require('fs');
		if (fs.existsSync(val)) {
			fs.readFile(val, 'utf8', function (err,data) {
				data = data.split('\n');
				for (var i = 0; i < data.length; i++) {
					if(module.exports.validate_input(data[i])){
						var gameObj = module.exports.make_gameobject(data[i]);
						console.log( module.exports.winning_hand(gameObj) );
					}
				}
			});
		}else{
			console.log(val+" Not Found.");
		}
	}
});