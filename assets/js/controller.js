export default class Controller {
    constructor() {
    }

    getRandomNumber(min = 0, max = 10) {
        return (min + Math.floor(Math.random() * (max - min + 1)));
    }

    vowelCount() {
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        let foundVowels = 0;
        const string = this.getUrlParameter('string');
        for (const element of string) {
            if (vowels.includes(element)) {
                foundVowels++;
            }
        }
        return foundVowels;
    }

    uniqueLetters() {
        const string = this.getUrlParameter('string');
        let uniqueLetters = [];
        for (const element of string) {
            if (!uniqueLetters.includes(element)) {
                uniqueLetters.push(element);
            }
        }
        return {
            uniqueLetters,
            count: uniqueLetters.length
        };
    }

    averageWordLength() {
        const stringParam = this.getUrlParameter('string');
        const string = decodeURI(stringParam);
        const wordCount = string.split(' ').length;
        const textLength = string.length;
        return (textLength / wordCount).toFixed(2);
    }

    getMultiples() {
        const count = parseFloat(this.getUrlParameter('count'));
        const number = parseFloat(this.getUrlParameter('number'));
        let multiples = [];
        let value = 0;
        for (let i = 0; i <= count; i++) {
            value += number;
            multiples.push(value);
        }
        return multiples;
    }

    fizzbuzz() {
        const number = parseInt(this.getUrlParameter('number'));
        let result = [];
        for (let i = 1; i <= number; i++) {
            result.push(this.getFizzbuzzFromNumber(i));
        }
        return result;
    }

    fibonacciSequence() {
        const count = parseInt(this.getUrlParameter('number'));
        let sequence = [];
        for (let i = 1; i <= count; i++) {
            sequence.push(this.getFibonacciValue(i));
        }
        return sequence;
    }

    fibonacciValue() {
        const number = parseInt(this.getUrlParameter('number'));
        return this.getFibonacciValue(number);
    }

    getFibonacciValue(number) {
        if (number <= 0) {
            return null;
        }
        if (number === 1) {
            return 0;
        }
        if (number === 2 || number === 3) {
            return 1;
        }
        let fibValues = [0, 1, 1];
        for (let i = 3; i < number; i++) {
            fibValues[i] = fibValues[i - 2] + fibValues[i - 1];
        }

        return fibValues[number - 1];
    }

    getFizzbuzzFromNumber(number) {
        if (number === 0) {
            return 0;
        }
        if (number % 15 === 0) {
            return 'fizzbuzz';
        }
        if (number % 3 === 0) {
            return 'fizz';
        }
        if (number % 5 === 0) {
            return 'buzz';
        }
        return number;
    }

    isPrimeNumber() {
        const number = parseInt(this.getUrlParameter('number'));
        return {
            number,
            isPrimeNumber: this.isNumberPrime(number)
        };
    }

    isNumberPrime(number) {
        return this.getDividers(number).length <= 2;
    }

    getDividers(number) {
        let dividers = [];
        let divider = number;
        while (divider > 0) {
            if (number % divider === 0) {
                dividers.push(divider);
            }
            divider--;
        }
        return dividers;
    }

    primeNumbers() {
        const number = parseInt(this.getUrlParameter('number'));
        const from = parseInt(this.getUrlParameter('from'));
        let i = from - 1;
        let primes = [];
        while (primes.length !== number) {
            if (this.isNumberPrime(i)) {
                primes.push(i);
            }
            i++;
        }
        return primes;
    }

    sum() {
        let numbers = this.getUrlParameter('numbers').split(',')
            .map(item => parseInt(item));
        let settings = this.getUrlParameter('settings');
        let resultNumbers = [];
        if (settings === null || settings === 'all') {
            resultNumbers = this.getEvenAndOdd(numbers);
        }
        if (settings === 'even') {
            resultNumbers = this.getItemsEven(numbers);
        }
        if (settings === 'odd') {
            resultNumbers = this.getItemsOdd(numbers);
        }
        return {
            numbers: resultNumbers,
            sum: resultNumbers.reduce((total, num) => total + num)
        };
    }

    getEvenAndOdd(numbersParam) {
        return numbersParam.filter(item => item % 1 === 0);
    }

    getItemsEven(numbersParam) {
        return numbersParam.filter(item => item % 2 === 0);
    }

    getItemsOdd(numbersParam) {
        return numbersParam.filter(item => item % 2 !== 0);
    }

    factors() {
        const number = parseInt(this.getUrlParameter('number'));
        let factors = [];
        for (let i = 0; i <= number; i++) {
            if (number % i !== 0) {
                continue;
            }
            factors.push(i);
        }
        return factors;
    }

    isPalindrome() {
        let word = this.getUrlParameter('word')
        return word === word.split('').reverse().join('');
    }

    romanNumberToInteger() {
        const romanNumberMapping = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000,
        };
        const romanNumberSubtractMapping = {
            // -1
            'IV': 4,
            'IX': 9,
            'IL': 49,
            'IC': 99,
            'ID': 499,
            'IM': 999,
            // -5
            'VL': 45,
            'VC': 95,
            'VD': 495,
            'VM': 995,
            // -10
            'XL': 40,
            'XC': 90,
            'XD': 490,
            'XM': 990,
            // -50
            'LD': 450,
            'LM': 950,
            // -100
            'CD': 400,
            'CM': 900,
        };

        const string = this.getUrlParameter('roman');
        let strlen = string.length;
        let int = 0;
        for (let i = 0; i < strlen; i++) {
            let index = i;
            let letter = string[index].toUpperCase();
            let nextLetter = (string[++index] ?? '').toUpperCase();
            let subtractIndex = (letter + nextLetter);
            let subtractMappingElement = romanNumberSubtractMapping[subtractIndex];
            let mappingElement = romanNumberMapping[letter];
            if (subtractMappingElement !== undefined) {
                int += subtractMappingElement;
                i++;
            } else if (mappingElement !== undefined) {
                int += mappingElement;
            }
        }
        return int;
    }

    getUrlVariables() {
        let variables = {};
        window.location.href.replace(
            /[?&]+([^=&]+)=([^&]*)/gi,
            function (m, key, value) {
                variables[key] = value;
            }
        );
        return variables;
    }

    getUrlParameter(parameter) {
        if (window.location.href.indexOf(parameter) === 0) return '';
        return this.getUrlVariables()[parameter] || null;
    }

    validateCompanyNumber() {
        let cin = this.getUrlParameter('number')
            .replace(/#\s+#/, '');
        if (cin.match(/\d{8}/) === null) {
            return false;
        }
        let check = 0;
        for (let i = 0; i < 7; i++) {
            check += parseInt(cin[i]) * (8 - i);
        }
        check %= 11;
        if (check === 0) {
            return parseInt(cin[7]) === 1;
        }
        if (check === 1) {
            return parseInt(cin[7]) === 0;
        }
        return parseInt(cin[7]) === 11 - check;
    }

    validateBirthNumber() {
        let pin = this.getUrlParameter('number');
        let matches = pin.match(/(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)/);
        if (matches === null) {
            return false;
        }
        let [, year, month, day, ext, c] = matches;
        if (c === '') {
            year = parseInt(year);
            year += year < 54 ? 1900 : 1800;
            return this.isDateValid(this.getMonth(month, year), day, year);
        }
        let controlEntity = (year + month + day + ext) % 11;
        if (controlEntity === 10) {
            controlEntity = 0;
        }
        if (controlEntity !== parseInt(c)) {
            return false;
        }
        year = parseInt(year);
        year += year < 54 ? 2000 : 1900;
        return this.isDateValid(this.getMonth(month, year), day, year);
    }

    isDateValid(month, day, year) {
        month = parseInt(month);
        day = parseInt(day);
        year = parseInt(year);

        return (0 <= month)
            && (month <= 11)
            && (0 < year)
            && (year < 32768)
            && (0 < day)
            && (day <= (new Date(year, month, 0)).getDate())
    }

    getMonth(month, year) {
        if (month === null) {
            month = this.getUrlParameter('month');
        }
        if (year === null) {
            year = this.getUrlParameter('year');
        }
        month = parseInt(month);
        year = parseInt(year);

        // k měsíci může být připočteno 20, 50 nebo 70
        if (month > 70 && year > 2003) {
            month -= 70;
            return month;
        }
        if (month > 50) {
            month -= 50;
            return month;
        }
        if (month > 20 && year > 2003) {
            month -= 20;
            return month;
        }
        return month;
    }
}
