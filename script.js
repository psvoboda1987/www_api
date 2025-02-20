let controller = {
    animalFacts: async () => {
        let animal = getUrlParameter('animal')
        console.log(animal);
        let json = await fetch('data/animal_facts.json')
            .then(data => data.json())
        let items = json.data
        if (animal) {
            let filteredItems = items.filter(item => item.animal === animal)
            let randomIndex = getRandomNumber(0, filteredItems.length);
            return filteredItems[randomIndex];
        }
        let randomIndex = getRandomNumber(0, items.length);
        return items[randomIndex];
    }
}

function getRandomNumber(min = 0, max = 10) {
    return (min + Math.floor(Math.random() * (max - min + 1)));
}

console.log(
    await(controller[getUrlParameter('m')]())
);


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
