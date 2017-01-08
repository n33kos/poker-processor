# poker-processor
A poker hand data processor and generator written in javascript for node.js.

## Usage
 * Use ```$ node poker.js {filename}``` to process a properly formatted file.

Each line of the input file should contain 20 alphanumeric characters which represent the value and suit of two 5 card hands. Example Data:
```
2H 3D 5S 9C KD 2C 3H 4S 8C AH
2H 4S 4C 2D 4H 2S 8S AS QS 3S
2H 3D 5S 9C KD 2C 3H 4S 8C KH
2H 3D 5S 9C KD 2D 3H 5C 9S KH
```

When used in this way poker.js will return a series of lines each one containing the results of the game.

## Testing
 * Use ```$ node tests/unit_tests.js``` to run the unit tests.

## Functions
* make_gameobject() - Makes a gameobject from a valid input
* validate_input() - Validates input for a set of hands
* rank_hand() - Ranks the provided hand
* highest_card() - Returns the highest card in a hand string
* winning_hand() - Returns "Black Wins.","White Wins.", or "Tie." based on the provided game object
* make_deck() - Generates a deck of cards
* draw_hands() - Randomly draws two 5 card hands from the provided deck
