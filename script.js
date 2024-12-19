const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

//генерируем ключ шифрования
function generateKey() {
    const length = Math.floor(Math.random() * 10) + 5; // Длина ключа от 5 до 15
    const key = Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    document.getElementById('keyInput').value = key;
}

//шифровка
function encrypt() {
    const inputText = document.getElementById('inputText').value.toUpperCase();
    const key = document.getElementById('keyInput').value.toUpperCase();

    if (!key) {
        alert('Введите или сгенерируйте ключ!');
        return;
    }

    const encryptedText = processVigenere(inputText, key, true);
    document.getElementById('resultText').innerText = 'Зашифрованный текст: ' + encryptedText;
}

//дешифровка
function decrypt() {
    const inputText = document.getElementById('inputText').value.toUpperCase();
    const key = document.getElementById('keyInput').value.toUpperCase();

    if (!key) {
        alert('Введите или сгенерируйте ключ!');
        return;
    }

    const decryptedText = processVigenere(inputText, key, false);
    document.getElementById('resultText').innerText = 'Дешифрованный текст: ' + decryptedText;
}

//Вижинимруем
function processVigenere(text, key, isEncrypt) {
    let result = '';
    let keyIndex = 0;

    for (const char of text) {
        const textIndex = alphabet.indexOf(char);

        if (textIndex === -1) {
            result += char;
            continue;
        }

        const keyIndexValue = alphabet.indexOf(key[keyIndex % key.length]);
        const newIndex = isEncrypt
            ? (textIndex + keyIndexValue) % alphabet.length
            : (textIndex - keyIndexValue + alphabet.length) % alphabet.length;

        result += alphabet[newIndex];
        keyIndex++;
    }

    return result;
}

//режим хацкера --------------------------------------------------------------------------------------
function crack() {
    const inputText = document.getElementById('inputText').value.toUpperCase();
    const frequencyMap = analyzeFrequency(inputText);

    const guessedKey = guessKey(inputText, frequencyMap);
    const crackedText = processVigenere(inputText, guessedKey, false);

    document.getElementById('resultText').innerText = `Взломанный текст: ${crackedText}\nУгаданный ключ: ${guessedKey}`;
}

//количество используемых в тексте букв
function analyzeFrequency(text) {
    const frequency = {};

    for (const char of text) {
        if (alphabet.includes(char)) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
    }

    return Object.entries(frequency).sort((a, b) => b[1] - a[1]);
}

//создание ключа дешифровки
function guessKey(text, frequencyMap) {
    const commonLetters = 'ОЕАИНТСРВЛК'; //самые распространенные буквы в русском яхыке
    const mostFrequentChar = frequencyMap[0][0];
    const guessedKey = commonLetters.split('').map((char, i) => {
        const textIndex = alphabet.indexOf(mostFrequentChar);
        const keyIndex = alphabet.indexOf(char);
        return alphabet[(textIndex - keyIndex + alphabet.length) % alphabet.length];
    }).join('');

    return guessedKey.slice(0, 5); // Возвращаем первые 5 символов как ключ
}
