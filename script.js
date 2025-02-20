let controller = {
    animalFacts: async () => {
        let animal = getUrlParameter('animal')
        console.log(animal);
        let data = await fetch('data/animal_facts.json')
            .then(data => data.json())
        console.log(data);

    }
}

controller[getUrlParameter('m')]()

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
