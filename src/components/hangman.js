import React, { useState, useEffect } from 'react';
import './hangman.css';

const HANGMAN_STAGES = [
  `
     +---+
         |
         |
         |
         |
        ===`,
  `
     +---+
     O   |
         |
         |
         |
        ===`,
  `
     +---+
     O   |
     |   |
         |
         |
        ===`,
  `
     +---+
     O   |
    /|   |
         |
         |
        ===`,
  `
     +---+
     O   |
    /|\\  |
         |
         |
        ===`,
  `
     +---+
     O   |
    /|\\  |
    /    |
         |
        ===`,
  `
     +---+
     O   |
    /|\\  |
    / \\  |
         |
        ===`,
];

const Hangman = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingGuesses, setRemainingGuesses] = useState(10);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameWon && remainingGuesses > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            revealRandomLetter();
            return 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameWon, remainingGuesses]);

  const handleWordSubmit = (event) => {
    event.preventDefault();
    const inputWord = event.target.word.value.toUpperCase();
    setWord(inputWord);
    setRemainingGuesses(10);
    setGuessedLetters([]);
    setGameWon(false);
    setGameStarted(true);
    setTimeLeft(60);
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter)) {
      alert('You already guessed this letter!');
      return;
    }
    setGuessedLetters([...guessedLetters, letter]);
  };

  const revealRandomLetter = () => {
    const unrevealedLetters = word.split('').filter(
      (char) => !guessedLetters.includes(char)
    );
    if (unrevealedLetters.length > 0) {
      const randomLetter =
        unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
      setGuessedLetters([...guessedLetters, randomLetter]);
      setRemainingGuesses((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    const wordAsSet = new Set(word);
    const guessedLettersSet = new Set(guessedLetters);
    if ([...wordAsSet].every((char) => guessedLettersSet.has(char))) {
      setGameWon(true);
    } else {
      const uniqueWrongGuesses = guessedLetters.filter(
        (letter) => !word.includes(letter)
      );
      setRemainingGuesses(10 - uniqueWrongGuesses.length);
    }
  }, [guessedLetters, word]);

  const restartGame = () => {
    setWord('');
    setGuessedLetters([]);
    setRemainingGuesses(10);
    setGameWon(false);
    setGameStarted(false);
    setTimeLeft(60);
  };

  const isGameLost = remainingGuesses === 0;
  const maskedWord = word
    .split('')
    .map((char) => (guessedLetters.includes(char) ? char : '_'))
    .join(' ');

  const hangmanStage =
    HANGMAN_STAGES[Math.min(6, 10 - remainingGuesses)] || HANGMAN_STAGES[0];

  return (
    <div className="hangman-container">
      {gameStarted && gameWon && (
        <div className="message">Congratulations! You guessed the word correctly!</div>
      )}
      {!gameStarted ? (
        <div>
          <form onSubmit={handleWordSubmit}>
            <label>
              Enter the word to guess:
              <input type="text" name="word" required />
            </label>
            <button type="submit">Start Game</button>
          </form>
        </div>
      ) : (
        <div>
          <pre className="hangman">{hangmanStage}</pre>
          <div className="word">Word: {gameWon ? word : maskedWord}</div>
          <div className="info">Remaining Guesses: {remainingGuesses}</div>
          <div className="info">Time Left: {timeLeft}s</div>
          <button
            className="hint-button"
            onClick={revealRandomLetter}
            disabled={gameWon || isGameLost || remainingGuesses <= 0}
          >
            Use Hint
          </button>
          <div className="buttons">
            {Array.from({ length: 26 }, (_, i) =>
              String.fromCharCode(65 + i)
            ).map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter) || isGameLost || gameWon}
              >
                {letter}
              </button>
            ))}
          </div>
          {isGameLost && (
            <div className="message">Game over! The word was {word}.</div>
          )}
          <button className="restart-button" onClick={restartGame}>
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Hangman;
