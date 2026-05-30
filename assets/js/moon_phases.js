import MoonPhase from './moonPhase.js'

let animation = requestAnimationFrame(renderMoonData)

function renderMoonData() {
    let dateSettings = {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC'
    }
    let distanceSettings = { minimumFractionDigits: 1, maximumFractionDigits: 1 }
    let timestamp = (new Date()).getTime();

    let moonPhase = new MoonPhase();

    let newMoonTimestamp = new Date(moonPhase.getPhaseNewMoon() * 1000).getTime();
    if (timestamp > newMoonTimestamp) {
        newMoonTimestamp = (new Date(moonPhase.getPhaseNextNewMoon() * 1000)).getTime()
    }

    let firstQuarterTimestamp = new Date(moonPhase.getPhaseFirstQuarter() * 1000).getTime();
    if (timestamp > firstQuarterTimestamp) {
        firstQuarterTimestamp = (new Date(moonPhase.getPhaseNextFirstQuarter() * 1000)).getTime()
    }

    let fullMoonTimestamp = new Date(moonPhase.getPhaseFullMoon() * 1000).getTime();
    if (timestamp > fullMoonTimestamp) {
        fullMoonTimestamp = (new Date(moonPhase.getPhaseNextFullMoon() * 1000)).getTime()
    }

    let lastQuarterTimestamp = new Date(moonPhase.getPhaseLastQuarter() * 1000).getTime();
    if (timestamp > lastQuarterTimestamp) {
        lastQuarterTimestamp = (new Date(moonPhase.getPhaseNextLastQuarter() * 1000)).getTime()
    }

    let moonData = {
        phaseName: moonPhase.getPhaseName(),
        phaseImage: moonPhase.getPhaseName().toLowerCase().replace(' ', '_'),
        illuminatedFraction: (moonPhase.getIllumination() * 100).toFixed(2),
        moonAge: moonPhase.getAge().toFixed(2),
        distance: moonPhase.getDistance().toLocaleString('cs-CZ', distanceSettings),
        diameter: moonPhase.getDiameter().toFixed(2),
        sunDistance: moonPhase.getSunDistance().toLocaleString('cs-CZ', distanceSettings),
        sunDiameter: moonPhase.getSunDiameter().toFixed(2),
        // Nov (nebo Novoluní) - Měsíc není vidět.
        dateNewMoon: new Intl.DateTimeFormat('cs-CZ', dateSettings)
            .format(newMoonTimestamp),

        // První čtvrť - Měsíc je osvětlený přesně z poloviny.
        dateFirstQuarter: new Intl.DateTimeFormat('cs-CZ', dateSettings)
            .format(new Date(firstQuarterTimestamp)),

        dateFullMoon: new Intl.DateTimeFormat('cs-CZ', dateSettings)
            .format(new Date(fullMoonTimestamp)),

        // Poslední čtvrť
        dateLastQuarter: new Intl.DateTimeFormat('cs-CZ', dateSettings)
            .format(new Date(lastQuarterTimestamp)),
    }

    document.getElementById('moonData').innerHTML = `
        <tr>
            <td>Phase name</td>
            <td>${moonData.phaseName}</td>
        </tr>
        <tr>
            <td>Phase Image</td>
            <td><img id="moon-icon" src="assets/icons/${moonData.phaseImage + '.png'}"></td>
        </tr>
        <tr>
            <td>Illuminated fraction</td>
            <td>${moonData.illuminatedFraction} %</td>
        </tr>
        <tr>
            <td>Age of moon</td>
            <td>${moonData.moonAge} days</td>
        </tr>
        <tr>
            <td>Distance</td>
            <td>${moonData.distance} km</td>
        </tr>
        <tr>
            <td>Angular diameter</td>
            <td>${moonData.diameter} degrees</td>
        </tr>
        <tr>
            <td>Distance to Sun</td>
            <td>${moonData.sunDistance} km</td>
        </tr>
        <tr>
            <td>Sun's angular diameter</td>
            <td>${moonData.sunDiameter} degrees</td>
        </tr>
        <tr>
            <td>Next full moon</td>
            <td>${moonData.dateFullMoon}</td>
        </tr>
        <tr>
            <td>Next last quarter</td>
            <td>${moonData.dateLastQuarter}</td>
        </tr>
        <tr>
            <td>Next new moon</td>
            <td>${moonData.dateNewMoon}</td>
        </tr>
        <tr>
            <td>Next first quarter</td>
            <td>${moonData.dateFirstQuarter}</td>
        </tr>`

    animation = requestAnimationFrame(renderMoonData)
}