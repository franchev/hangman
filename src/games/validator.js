export default function guessLetterValidator(req, res, next) {
  const letter = String(req.body.letter);

  if (letter.length !== 1) {
    return res.status(400).json({
      message: 'A guess must be a single letter',
    });
  }

  if (!/^[a-z]$/.test(letter)) {
    return res.status(400).json({
      message: 'A guess must be a letter in the English alphabet',
    });
  }

  return next();
}
