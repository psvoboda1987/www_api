// Astronomical constants. 1980 January 0.0
const EPOCH_1980 = 2_444_238.5;

// Constants defining the Sun's apparent orbit
const SUN_ELLIPTIC_LONGITUDE_AT_1980 = 278.833540;
const SUN_ELLIPTIC_LONGITUDE_AT_PERIGEE = 282.596403;
const EARTH_ORBIT_ECCENTRICITY = 0.016718;
const EARTH_ORBIT_SEMI_MAJOR_AXIS_KM = 1.495985e8;
const SUN_ANGULAR_SEMI_MAJOR_AXIS_SIZE_DEG = 0.533128;

const MOON_MEAN_LONGITUDE_AT_1980 = 64.975464;
const MEAN_LONGITUDE_OF_PERIGEE_AT_EPOCH = 349.383063;
const MOON_ORBIT_ECCENTRICITY = 0.054900;
// Moon's angular size at distanceKm a from Earth
const MOON_ANGULAR_SIZE_FROM_EARTH_KM = 0.5181;
const MOON_ORBIT_SEMI_MAJOR_AXIS_KM = 384401;

const SYNODIC_MONTH_DAYS = 29.53058868;
const DAY_IN_SECONDS = 86_400;
const JULIAN_DATE_UNIX_EPOCH = 2_440_587.5;

const PHASES = [
    'new_moon',
    'first_quarter',
    'full_moon',
    'last_quarter',
    'next_new_moon',
    'next_first_quarter',
    'next_full_moon',
    'next_last_quarter',
];
const NAMES = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Third Quarter',
    'Waning Crescent',
];

export default class MoonPhase {
    constructor(date = new Date()) {
        this.utcTimestamp = date.getTime();

        // date is coming in as a UNIX timestamp in milliseconds, so convert it to Julian
        let julianDate = this.utcTimestamp / (DAY_IN_SECONDS * 1000) + JULIAN_DATE_UNIX_EPOCH;

        // Calculation of the Sun's position
        const dayInEpoch = julianDate - EPOCH_1980;
        const sunsMeanAnomaly = MoonPhase.fixAngle((360 / 365.2422) * dayInEpoch);

        // Convert from perigee co-ordinates to epoch1980 1980.0
        const sunMeanAnomaly = MoonPhase.fixAngle(sunsMeanAnomaly + SUN_ELLIPTIC_LONGITUDE_AT_1980 - SUN_ELLIPTIC_LONGITUDE_AT_PERIGEE);

        // Solve equation of Kepler
        let ec = this.kepler(sunMeanAnomaly, EARTH_ORBIT_ECCENTRICITY);
        ec = Math.sqrt((1 + EARTH_ORBIT_ECCENTRICITY) / (1 - EARTH_ORBIT_ECCENTRICITY)) * Math.tan(ec / 2);

        // True anomaly
        ec = 2 * MoonPhase.radiansToDegrees(Math.atan(ec));

        // Sun's geocentric ecliptic longitude
        const lambdaSun = MoonPhase.fixAngle(ec + SUN_ELLIPTIC_LONGITUDE_AT_PERIGEE);
        const orbitalDistanceFactor = ((1 + EARTH_ORBIT_ECCENTRICITY * Math.cos(MoonPhase.degreesToRadians(ec))) / (1 - EARTH_ORBIT_ECCENTRICITY * EARTH_ORBIT_ECCENTRICITY));
        const sunDistanceKm = EARTH_ORBIT_SEMI_MAJOR_AXIS_KM / orbitalDistanceFactor;
        const sunAngularSizeDeg = orbitalDistanceFactor * SUN_ANGULAR_SEMI_MAJOR_AXIS_SIZE_DEG;

        // Calculation of the Moon's position
        const moonMeanLongitude = MoonPhase.fixAngle(13.1763966 * dayInEpoch + MOON_MEAN_LONGITUDE_AT_1980);
        const moonMeanAnomaly = MoonPhase.fixAngle(moonMeanLongitude - 0.1114041 * dayInEpoch - MEAN_LONGITUDE_OF_PERIGEE_AT_EPOCH);
        const evection = 1.2739 * Math.sin(MoonPhase.degreesToRadians(2 * (moonMeanLongitude - lambdaSun) - moonMeanAnomaly));
        const annualEquation = 0.1858 * Math.sin(MoonPhase.degreesToRadians(sunMeanAnomaly));

        const correctionA3 = 0.37 * Math.sin(MoonPhase.degreesToRadians(sunMeanAnomaly));
        const correctedAnomaly = moonMeanAnomaly + evection - annualEquation - correctionA3;

        // Correction for the equation of the center
        const mEc = 6.2886 * Math.sin(MoonPhase.degreesToRadians(correctedAnomaly));

        // Another correction term
        const a4 = 0.214 * Math.sin(MoonPhase.degreesToRadians(2 * correctedAnomaly));
        const correctedLongitude = moonMeanLongitude + evection + mEc - annualEquation + a4;
        const variation = 0.6583 * Math.sin(MoonPhase.degreesToRadians(2 * (correctedLongitude - lambdaSun)));
        const trueLongitude = correctedLongitude + variation;

        // Calculation of the Moon's phase
        const moonAgeDeg = trueLongitude - lambdaSun;
        const moonDistanceFromEarthCentre = (MOON_ORBIT_SEMI_MAJOR_AXIS_KM * (1 - MOON_ORBIT_ECCENTRICITY * MOON_ORBIT_ECCENTRICITY)) / (1 + MOON_ORBIT_ECCENTRICITY * Math.cos(this.degreesToRadians(correctedAnomaly + mEc)));
        const moonDFrac = moonDistanceFromEarthCentre / MOON_ORBIT_SEMI_MAJOR_AXIS_KM;
        const moonAngularDiameter = MOON_ANGULAR_SIZE_FROM_EARTH_KM / moonDFrac;

        this.phase0to1 = MoonPhase.fixAngle(moonAgeDeg) / 360;
        this.illuminatedFraction0to1 = (1 - Math.cos(MoonPhase.degreesToRadians(moonAgeDeg))) / 2;
        this.moonAgeDays = SYNODIC_MONTH_DAYS * this.phase0to1;
        this.distanceKm = moonDistanceFromEarthCentre;
        this.angularDiameterDeg = moonAngularDiameter;
        this.sunDistanceKm = sunDistanceKm;
        this.sunAngularDiameterDeg = sunAngularSizeDeg;
        this.phases = PHASES;
        this.names = NAMES;
    }

    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    static fixAngle(angle) {
        return angle - 360 * Math.floor(angle / 360);
    }

    kepler(sunMeanAnomaly, ecc) {
        // 1E-6
        const epsilon = 0.000001;
        let e = sunMeanAnomaly = this.degreesToRadians(sunMeanAnomaly);

        while (true) {
            const delta = e - ecc * Math.sin(e) - sunMeanAnomaly;
            if (Math.abs(delta) <= epsilon) {
                return e;
            }
            e -= delta / (1 - ecc * Math.cos(e));
        }
    }

    /**
     * Calculates time  of the mean new Moon for a given base date.
     * This argument K to this function is the precomputed synodic month index, given by:
     * K = (year - 1900) * 12.3685
     * where year is expressed as a year and fractional year.
     */
    meanPhase(moonTime) {
        // Time in Julian centuries from 1900 January 0.5
        const julianTime = 2_415_020.0 / 36525;
        return 2_415_020.75933 + SYNODIC_MONTH_DAYS * moonTime
            + 0.0001178 * julianTime**2
            - 0.000000155 *  julianTime**3
            + 0.00033 * Math.sin(this.degreesToRadians(166.56 + 132.87 * julianTime - 0.009173 * julianTime**2));
    }

    /**
     * Obtains the true, high-precision Julian Date time of a moon phase.
     * Based on Astronomical Algorithms of Jean Meeus.
     * @param {number} lunationIndex - Integer count of synodic months since 1900 epoch (K).
     * @param {number} phaseFraction - Phase selector: 0.0 (New), 0.25 (1st Qtr), 0.5 (Full), 0.75 (3rd Qtr).
     * @returns {number|null} The corrected Julian Date, or null if the phase is invalid.
     */
    truePhase(lunationIndex, phaseFraction) {
        // Determine if this is a primary phase with a minor rounding tolerance
        const isNewOrFull = phaseFraction < 0.01 || Math.abs(phaseFraction - 0.5) < 0.01;
        const isQuarter = Math.abs(phaseFraction - 0.25) < 0.01 || Math.abs(phaseFraction - 0.75) < 0.01;

        // Fail early if an invalid phase fraction is supplied
        if (!isNewOrFull && !isQuarter) {
            return null;
        }

        // Combine index and fraction into a continuous lunation value
        const kWithPhase = lunationIndex + phaseFraction;

        // Calculate time in Julian centuries from 1900 January 0.5
        const timeCenturies = kWithPhase / 1236.85;
        const timeSquared = timeCenturies * timeCenturies;
        const timeCubed = timeSquared * timeCenturies;

        // Local helper to shrink the trigonometric visual clutter
        const degToRad = (degrees) => this.degreesToRadians(degrees);

        // Initial base estimate of the Julian Date for the mean phase
        let calculatedJulianDate = 2_415_020.75933
            + SYNODIC_MONTH_DAYS * kWithPhase
            + 0.0001178 * timeSquared
            - 0.000000155 * timeCubed
            + 0.00033 * Math.sin(degToRad(166.56 + 132.87 * timeCenturies - 0.009173 * timeSquared));

        // Calculate anomalies (Sun, Moon, and Moon's argument of latitude)
        const sunMeanAnomaly = 359.2242 + 29.10535608 * kWithPhase - 0.0000333 * timeSquared - 0.00000347 * timeCubed;
        const moonMeanAnomaly = 306.0253 + 385.81691806 * kWithPhase + 0.0107306 * timeSquared + 0.00001236 * timeCubed;
        const argumentOfLatitude = 21.2964 + 390.67050646 * kWithPhase - 0.0016528 * timeSquared - 0.00000239 * timeCubed;

        if (isNewOrFull) {
            // High-precision periodic corrections for New and Full Moon
            calculatedJulianDate += (0.1734 - 0.000393 * timeCenturies) * Math.sin(degToRad(sunMeanAnomaly))
                + 0.0021 * Math.sin(degToRad(2 * sunMeanAnomaly))
                - 0.4068 * Math.sin(degToRad(moonMeanAnomaly))
                + 0.0161 * Math.sin(degToRad(2 * moonMeanAnomaly))
                - 0.0004 * Math.sin(degToRad(3 * moonMeanAnomaly))
                + 0.0104 * Math.sin(degToRad(2 * argumentOfLatitude))
                - 0.0051 * Math.sin(degToRad(sunMeanAnomaly + moonMeanAnomaly))
                - 0.0074 * Math.sin(degToRad(sunMeanAnomaly - moonMeanAnomaly))
                + 0.0004 * Math.sin(degToRad(2 * argumentOfLatitude + sunMeanAnomaly))
                - 0.0004 * Math.sin(degToRad(2 * argumentOfLatitude - sunMeanAnomaly))
                - 0.0006 * Math.sin(degToRad(2 * argumentOfLatitude + moonMeanAnomaly))
                + 0.0010 * Math.sin(degToRad(2 * argumentOfLatitude - moonMeanAnomaly))
                + 0.0005 * Math.sin(degToRad(sunMeanAnomaly + 2 * moonMeanAnomaly));
        } else {
            // High-precision periodic corrections for First and Last Quarters
            calculatedJulianDate += (0.1721 - 0.0004 * timeCenturies) * Math.sin(degToRad(sunMeanAnomaly))
                + 0.0021 * Math.sin(degToRad(2 * sunMeanAnomaly))
                - 0.6280 * Math.sin(degToRad(moonMeanAnomaly))
                + 0.0089 * Math.sin(degToRad(2 * moonMeanAnomaly))
                - 0.0004 * Math.sin(degToRad(3 * moonMeanAnomaly))
                + 0.0079 * Math.sin(degToRad(2 * argumentOfLatitude))
                - 0.0119 * Math.sin(degToRad(sunMeanAnomaly + moonMeanAnomaly))
                - 0.0047 * Math.sin(degToRad(sunMeanAnomaly - moonMeanAnomaly))
                + 0.0003 * Math.sin(degToRad(2 * argumentOfLatitude + sunMeanAnomaly))
                - 0.0004 * Math.sin(degToRad(2 * argumentOfLatitude - sunMeanAnomaly))
                - 0.0006 * Math.sin(degToRad(2 * argumentOfLatitude + moonMeanAnomaly))
                + 0.0021 * Math.sin(degToRad(2 * argumentOfLatitude - moonMeanAnomaly))
                + 0.0003 * Math.sin(degToRad(sunMeanAnomaly + 2 * moonMeanAnomaly))
                + 0.0004 * Math.sin(degToRad(sunMeanAnomaly - 2 * moonMeanAnomaly))
                - 0.0003 * Math.sin(degToRad(2 * sunMeanAnomaly + moonMeanAnomaly));

            // Planetary/Quarter adjustments based on which quarter hemisphere we are in
            const quarterSign = phaseFraction < 0.5 ? 1 : -1;
            calculatedJulianDate += quarterSign * (0.0028 - 0.0004 * Math.cos(degToRad(sunMeanAnomaly)) + 0.0003 * Math.cos(degToRad(moonMeanAnomaly)));
        }

        return calculatedJulianDate;
    }

    /**
     * Find time of phases of the moon which surround the current date. Five phases are found, starting and ending with the new moons which bound the current lunation.
     */
    phaseHunt() {
        const targetJulianDate = this.getJulianFromUTC(this.utcTimestamp);
        const searchTimestampMs = this.utcTimestamp - (DAY_IN_SECONDS * 1000 * 45);
        const date = new Date(searchTimestampMs);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        // Calculate approximate lunation index (k) since the base epoch
        let currentLunationIndex = Math.floor((year + ((month - 1) * (1 / 12)) - 1900) * 12.3685);
        let currentPhaseJulian = this.meanPhase(currentLunationIndex);

        let searchJulianDate = currentPhaseJulian;
        let nextLunationIndex;
        let safetyIteration = 0;

        while (safetyIteration < 1000) {
            searchJulianDate += SYNODIC_MONTH_DAYS;
            nextLunationIndex = currentLunationIndex + 1;
            let nextPhaseJulian = this.meanPhase(nextLunationIndex);

            // If next phase is close to target, use high-precision true phase calculation
            if (Math.abs(nextPhaseJulian - targetJulianDate) < 0.75) {
                nextPhaseJulian = this.truePhase(nextLunationIndex, 0.0);
            }

            // Break if target date falls safely inside this lunation window
            if (currentPhaseJulian <= targetJulianDate && nextPhaseJulian > targetJulianDate) {
                break;
            }

            currentPhaseJulian = nextPhaseJulian;
            currentLunationIndex = nextLunationIndex;
            safetyIteration++;
        }

        const datesJulian = [
            this.truePhase(currentLunationIndex, 0.0),
            this.truePhase(currentLunationIndex, 0.25),
            this.truePhase(currentLunationIndex, 0.5),
            this.truePhase(currentLunationIndex, 0.75),
            this.truePhase(nextLunationIndex, 0.0),
            this.truePhase(nextLunationIndex, 0.25),
            this.truePhase(nextLunationIndex, 0.5),
            this.truePhase(nextLunationIndex, 0.75),
        ];

        this.quarters = [];
        for (const julianDate of datesJulian) {
            // Convert Julian Date to UNIX time seconds
            this.quarters.push((julianDate - JULIAN_DATE_UNIX_EPOCH) * DAY_IN_SECONDS);
        }
    }

    getJulianFromUTC(utcTimestamp) {
        return utcTimestamp / (DAY_IN_SECONDS * 1000) + JULIAN_DATE_UNIX_EPOCH;
    }

    getPhase() {
        return this.phase0to1;
    }

    getIllumination() {
        return this.illuminatedFraction0to1;
    }

    getAge() {
        return this.moonAgeDays;
    }

    getDistance() {
        return this.distanceKm;
    }

    getDiameter() {
        return this.angularDiameterDeg;
    }

    getSunDistance() {
        return this.sunDistanceKm;
    }

    getSunDiameter() {
        return this.sunAngularDiameterDeg;
    }

    getPhaseByName(name) {
        if (typeof this.quarters === 'undefined') {
            this.phaseHunt();
        }
        const index = this.phases.indexOf(name);
        return index !== -1 ? this.quarters[index] : null;
    }

    getPhaseName() {
        const index = Math.floor((this.phase0to1 + 0.0625) * 8);
        // % 8 prevents array overflow
        return this.names[index % 8];
    }

    getPhaseNewMoon() {
        return this.getPhaseByName('new_moon');
    }

    getPhaseFirstQuarter() {
        return this.getPhaseByName('first_quarter');
    }

    getPhaseFullMoon() {
        return this.getPhaseByName('full_moon');
    }

    getPhaseLastQuarter() {
        return this.getPhaseByName('last_quarter');
    }

    getPhaseNextNewMoon() {
        return this.getPhaseByName('next_new_moon');
    }

    getPhaseNextFirstQuarter() {
        return this.getPhaseByName('next_first_quarter');
    }

    getPhaseNextFullMoon() {
        return this.getPhaseByName('next_full_moon');
    }

    getPhaseNextLastQuarter() {
        return this.getPhaseByName('next_last_quarter');
    }
}
