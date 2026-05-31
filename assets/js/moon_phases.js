import MoonPhase from './moonPhase.js';

const DISTANCE_SETTINGS = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
const DATE_FORMATTER = new Intl.DateTimeFormat('cs-CZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC'
});

const dom = {
    phaseName: document.getElementById('md-phaseName'),
    phaseImage: document.getElementById('md-phaseImage'),
    illuminated: document.getElementById('md-illuminated'),
    moonAge: document.getElementById('md-moonAge'),
    distance: document.getElementById('md-distance'),
    diameter: document.getElementById('md-diameter'),
    sunDistance: document.getElementById('md-sunDistance'),
    sunDiameter: document.getElementById('md-sunDiameter'),
    dateFullMoon: document.getElementById('md-dateFullMoon'),
    dateLastQuarter: document.getElementById('md-dateLastQuarter'),
    dateNewMoon: document.getElementById('md-dateNewMoon'),
    dateFirstQuarter: document.getElementById('md-dateFirstQuarter')
};

function getFuturePhaseTimestamp(timestamp, currentPhaseSec, nextPhaseSec) {
    const currentMs = currentPhaseSec * 1000;
    return timestamp > currentMs ? nextPhaseSec * 1000 : currentMs;
}

renderMoonData();
setInterval(renderMoonData, 1000);

function renderMoonData() {
    const now = new Date();
    const timestamp = now.getTime();
    const moonPhase = new MoonPhase(now);

    const nextNewMoon = getFuturePhaseTimestamp(
        timestamp, moonPhase.getPhaseNewMoon(), moonPhase.getPhaseNextNewMoon()
    );
    const nextFirstQuarter = getFuturePhaseTimestamp(
        timestamp, moonPhase.getPhaseFirstQuarter(), moonPhase.getPhaseNextFirstQuarter()
    );
    const nextFullMoon = getFuturePhaseTimestamp(
        timestamp, moonPhase.getPhaseFullMoon(), moonPhase.getPhaseNextFullMoon()
    );
    const nextLastQuarter = getFuturePhaseTimestamp(
        timestamp, moonPhase.getPhaseLastQuarter(), moonPhase.getPhaseNextLastQuarter()
    );

    const phaseNameStr = moonPhase.getPhaseName();
    const imageNameStr = phaseNameStr.toLowerCase().replace(' ', '_');

    dom.phaseName.textContent = phaseNameStr;
    dom.phaseImage.src = `assets/icons/${imageNameStr}.png`;
    dom.illuminated.textContent = (moonPhase.getIllumination() * 100).toFixed(2);
    dom.moonAge.textContent = moonPhase.getAge().toFixed(2);
    dom.distance.textContent = moonPhase.getDistance().toLocaleString('cs-CZ', DISTANCE_SETTINGS);
    dom.diameter.textContent = moonPhase.getDiameter().toFixed(2);
    dom.sunDistance.textContent = moonPhase.getSunDistance().toLocaleString('cs-CZ', DISTANCE_SETTINGS);
    dom.sunDiameter.textContent = moonPhase.getSunDiameter().toFixed(2);
    dom.dateNewMoon.textContent = DATE_FORMATTER.format(nextNewMoon);
    dom.dateFirstQuarter.textContent = DATE_FORMATTER.format(nextFirstQuarter);
    dom.dateFullMoon.textContent = DATE_FORMATTER.format(nextFullMoon);
    dom.dateLastQuarter.textContent = DATE_FORMATTER.format(nextLastQuarter);
}
