const controller = {
    fallback: () => {
        return {};
    },
    animalFacts: async () => {
        const animal = getUrlParameter('animal')
        const items = await fetch('data/animal_facts.json')
            .then(reply => reply.json())
            .then(json => json.data);
        if (animal) {
            const filteredItems = items.filter(item => item.animal === animal);
            const randomIndex = getRandomNumber(0, filteredItems.length);
            return filteredItems[randomIndex];
        }
        const randomIndex = getRandomNumber(0, items.length);
        return items[randomIndex];
    },
    vowelCount: () => {
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        let foundVowels = 0;
        const string = getUrlParameter('string');
        for (const element of string) {
            if (vowels.includes(element)) {
                foundVowels++;
            }
        }
        return foundVowels;
    },
    chuckNorrisJokes: async () => {
        const items = await fetch('data/chuck_jokes.json')
            .then(reply => reply.json())
            .then(json => json.data);
        const randomIndex = getRandomNumber(0, items.length);
        return items[randomIndex];
    },
    cities: async () => {
        const zip = getUrlParameter('zip');
        const items = await fetch('data/post_codes.json')
            .then(reply => reply.json())
            .then(json => json.data);
        let filteredItems = items.filter(item => item.zip === zip)
        return filteredItems;
    },
    counties: async () => {
        const county = decodeURI(getUrlParameter('county'));
        const items = await fetch('data/post_codes.json')
            .then(reply => reply.json())
            .then(json => json.data);
        let filteredItems = items.filter(item => item.county === county)
        return filteredItems;
    },
    countries: async () => {
        const country = getUrlParameter('country');
        const items = await fetch('data/countries.json')
            .then(reply => reply.json())
            .then(json => json.data);
        let filteredItems = items.filter(item => item.country === country);
        return {
            country,
            capital: filteredItems[0].capital
        };
    },
    postalCodes: async () => {
        const city = getUrlParameter('city');
        const items = await fetch('data/post_codes.json')
            .then(reply => reply.json())
            .then(json => json.data);
        let filteredItems = items.filter(item => item.city === city);
        return filteredItems;
    },
    regions: async () => {
        const zip = getUrlParameter('zip');
        const items = await fetch('data/post_codes.json')
            .then(reply => reply.json())
            .then(json => json.data);
        let filteredItems = items.filter(item => item.zip === zip)
        return {
            zip,
            region: filteredItems[0].region
        };
    },
    uniqueLetters: () => {
        const string = getUrlParameter('string');
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
    },
    averageWordLength: () => {
        const stringParam = getUrlParameter('string');
        const string = decodeURI(stringParam);
        const wordCount = string.split(' ').length;
        const textLength = string.length;
        return (textLength / wordCount).toFixed(2);
    },
    getMultiples: () => {
        const count = parseFloat(getUrlParameter('count'));
        const number = parseFloat(getUrlParameter('number'));
        let multiples = [];
        let value = 0;
        for (let i = 0; i <= count; i++) {
            value += number;
            multiples.push(value);
        }
        return multiples;
    },
    fizzbuzz: () => {
        const number = parseInt(getUrlParameter('number'));
        let result = [];
        for (let i = 1; i <= number; i++) {
            result.push(getFizzbuzzFromNumber(i));
        }
        return result;
    },
    fibonacciSequence: () => {
        const count = parseInt(getUrlParameter('number'));
        let sequence = [];
        for (let i = 1; i <= count; i++) {
            sequence.push(getFibonacciValue(i));
        }
        return sequence;
    },
    fibonacciValue: () => {
        const number = parseInt(getUrlParameter('number'));
        return getFibonacciValue(number);
    },
    isPrimeNumber: () => {
        const number = parseInt(getUrlParameter('number'));
        return {
            number,
            isPrimeNumber: isNumberPrime(number)
        };
    },
    primeNumbers: () => {
        const number = parseInt(getUrlParameter('number'));
        const from = parseInt(getUrlParameter('from'));
        let i = from - 1;
        let primes = [];
        while (primes.length !== number) {
            if (isNumberPrime(i)) {
                primes.push(i);
            }
            i++;
        }
        return primes;
    },
    sum: () => {
        let numbers = getUrlParameter('numbers').split(',')
            .map(item => parseInt(item));
        let settings = getUrlParameter('settings');
        let resultNumbers = [];
        if (settings === null || settings === 'all') {
            resultNumbers = getEvenAndOdd(numbers);
        }
        if (settings === 'even') {
            resultNumbers = getItemsEven(numbers);
        }
        if (settings === 'odd') {
            resultNumbers = getItemsOdd(numbers);
        }
        return {
            numbers: resultNumbers,
            sum: resultNumbers.reduce((total, num) => total + num)
        };
    },
    factors: () => {
        const number = parseInt(getUrlParameter('number'));
        let factors = [];
        for (let i = 0; i <= number; i++) {
            if (number % i !== 0) {
                continue;
            }
            factors.push(i);
        }
        return factors;
    },
    isPalindrome: () => {
        let word = getUrlParameter('word')
        return word === word.split('').reverse().join('');
    },
    romanNumberToInteger: () => {
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

        const string = getUrlParameter('roman');
        let strlen = string.length;
        let int = 0;
        for (let i = 0; i < strlen; i++) {
            let index = i;
            let letter = string[index];
            let nextLetter = string[++index] ?? '';

            if (romanNumberSubtractMapping[letter + nextLetter] !== undefined) {
                int += romanNumberSubtractMapping[letter + nextLetter];
                i++;
            } else if (romanNumberMapping[letter + nextLetter] !== undefined) {
                int += romanNumberMapping[letter];
            }
        }
        return int;
    }
}

function getEvenAndOdd(numbersParam) {
    return numbersParam.filter(item => item % 1 === 0);
}

function getItemsEven(numbersParam) {
    let numbers = numbersParam.filter(item => item % 2 === 0);
    return numbers;
}

function getItemsOdd(numbersParam) {
    let numbers = numbersParam.filter(item => item % 2 !== 0);
    return numbers;
}

function getFibonacciValue(number) {
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

function getFizzbuzzFromNumber(number) {
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

function isNumberPrime(number) {
    return getDividers(number).length <= 2;
}

function getDividers(number) {
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

function getRandomNumber(min = 0, max = 10) {
    return (min + Math.floor(Math.random() * (max - min + 1)));
}

function getUrlVariables() {
    let variables = {};
    let parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            variables[key] = value;
        }
    );
    return variables;
}

function getUrlParameter(parameter) {
    if (window.location.href.indexOf(parameter) === 0) return '';
    return getUrlVariables()[parameter];
}

console.log((getUrlParameter('m')))
console.log(
    await(controller[getUrlParameter('m')]())
);
