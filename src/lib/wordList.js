import fs from 'fs';
import path from 'path';

const dictionary = fs.readFileSync(path.join(__dirname, 'dictionary.txt'));

export default dictionary.toString().split('\n');
