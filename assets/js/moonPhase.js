export default class MoonPhase {
    constructor(date = new Date()) {
        this.utcTimestamp = date.getTime();

        // Astronomical constants. 1980 January 0.0
        const epoch1980 = 2_444_238.5;

        // Constants defining the Sun's apparent orbit
        const sunElipticLongitudeAt1980 = 278.833540;
        const sunElipticLongitudeAtPerigee = 282.596403;
        const earthOrbitEccentricity = 0.016718;
        const earthOrbitSemiMajorAxisKm = 1.495985e8;
        // Sun's angular size, degrees, at semi-major axis distanceKm
        const sunangsiz = 0.533128;

        const moonMeanLongitudeAt1980 = 64.975464;
        const meanLongitudeOfPerigeeAtEpoch = 349.383063;
        const moonOrbitEccentricity = 0.054900;
        // Moon's angular size at distanceKm a from Earth
        const mangsiz = 0.5181;
        const moonOrbitSemiMajorAxisKm = 384401;
        this.synodicMonthDays = 29.53058868;
        // date is coming in as a UNIX timstamp in milliseconds, so convert it to Julian
        this.dayInSeconds = 86_400;
        this.julianDateUnixEpoch = 2_440_587.5;
        date = date / (this.dayInSeconds * 1000) + this.julianDateUnixEpoch;

        // Calculation of the Sun's position
        const dayInEpoch = date - epoch1980;
        const sunsMeanAnomaly = this.fixAngle((360 / 365.2422) * dayInEpoch);

        // Convert from perigee co-ordinates to epoch1980 1980.0
        const sunMeanAnomaly = this.fixAngle(sunsMeanAnomaly + sunElipticLongitudeAt1980 - sunElipticLongitudeAtPerigee);

        // Solve equation of Kepler
        let ec = this.kepler(sunMeanAnomaly, earthOrbitEccentricity);
        ec = Math.sqrt((1 + earthOrbitEccentricity) / (1 - earthOrbitEccentricity)) * Math.tan(ec / 2);

        // True anomaly
        ec = 2 * this.radiansToDegrees(Math.atan(ec));

        // Sun's geocentric ecliptic longitude
        const lambdaSun = this.fixAngle(ec + sunElipticLongitudeAtPerigee);
        const orbitalDistanceFactor = ((1 + earthOrbitEccentricity * Math.cos(this.degreesToRadians(ec))) / (1 - earthOrbitEccentricity * earthOrbitEccentricity));
        const sunDistanceKm = earthOrbitSemiMajorAxisKm / orbitalDistanceFactor;
        const sunAngularSizeDeg = orbitalDistanceFactor * sunangsiz;

        // Calculation of the Moon's position
        const moonMeanLongitude = this.fixAngle(13.1763966 * dayInEpoch + moonMeanLongitudeAt1980);
        const moonMeanAnomaly = this.fixAngle(moonMeanLongitude - 0.1114041 * dayInEpoch - meanLongitudeOfPerigeeAtEpoch);
        const evection = 1.2739 * Math.sin(this.degreesToRadians(2 * (moonMeanLongitude - lambdaSun) - moonMeanAnomaly));
        const annualEquation = 0.1858 * Math.sin(this.degreesToRadians(sunMeanAnomaly));

        const correctionA3 = 0.37 * Math.sin(this.degreesToRadians(sunMeanAnomaly));
        const correctedAnomaly = moonMeanAnomaly + evection - annualEquation - correctionA3;

        // Correction for the equation of the centre
        const mEc = 6.2886 * Math.sin(this.degreesToRadians(correctedAnomaly));

        // Another correction term
        const a4 = 0.214 * Math.sin(this.degreesToRadians(2 * correctedAnomaly));
        const correctedLongitude = moonMeanLongitude + evection + mEc - annualEquation + a4;
        const variation = 0.6583 * Math.sin(this.degreesToRadians(2 * (correctedLongitude - lambdaSun)));
        const trueLongitude = correctedLongitude + variation;

        // Calculation of the Moon's phase
        const moonAgeDeg = trueLongitude - lambdaSun;
        const moonPhase = (1 - Math.cos(this.degreesToRadians(moonAgeDeg))) / 2;
        const moonDistanceFromEarthCentre = (moonOrbitSemiMajorAxisKm * (1 - moonOrbitEccentricity * moonOrbitEccentricity)) / (1 + moonOrbitEccentricity * Math.cos(this.degreesToRadians(correctedAnomaly + mEc)));
        const moonDFrac = moonDistanceFromEarthCentre / moonOrbitSemiMajorAxisKm;
        const moonAngularDiameter = mangsiz / moonDFrac;

        this.phase0to1 = this.fixAngle(moonAgeDeg) / 360;
        this.illuminatedFraction0to1 = moonPhase;
        this.moonAgeDays = this.synodicMonthDays * this.phase0to1;
        this.distanceKm = moonDistanceFromEarthCentre;
        this.angularDiameterDeg = moonAngularDiameter;
        this.moonAgeDeg = moonAgeDeg;
        this.sunDistanceKm = sunDistanceKm;
        this.sunAngularDiameterDeg = sunAngularSizeDeg;
        this.phases = [
            'new_moon',
            'first_quarter',
            'full_moon',
            'last_quarter',
            'next_new_moon',
            'next_first_quarter',
            'next_full_moon',
            'next_last_quarter',
        ];
        this.names = [
            'New Moon',
            'Waxing Crescent',
            'First Quarter',
            'Waxing Gibbous',
            'Full Moon',
            'Waning Gibbous',
            'Third Quarter',
            'Waning Crescent',
        ];
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    fixAngle(angle) {
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
        const jt = 2_415_020.0 / 36525;
        const timeSquared = jt * jt;
        const timeQubed = timeSquared * jt;

        return 2_415_020.75933 + this.synodicMonthDays * moonTime
            + 0.0001178 * timeSquared
            - 0.000000155 * timeQubed
            + 0.00033 * Math.sin(this.degreesToRadians(166.56 + 132.87 * jt - 0.009173 * timeSquared));
    }

    /**
     * Given a K value used to determine the mean phase0to1 of the new moon and a phase0to1 selector (0.0, 0.25, 0.5, 0.75), obtain the true, corrected phase0to1 time.
     */
    truePhase(moonTime, phase0to1) {
        let apcor = false;
        moonTime += phase0to1;

        // Time in Julian centuries from 1900 January 0.5
        const time = moonTime / 1236.85;
        const timeSquared = time * time;
        const timeQubed = timeSquared * time;

        // Mean time of phase0to1
        let moonPhaseMeanTime = 2_415_020.75933
            + this.synodicMonthDays * moonTime
            + 0.0001178 * timeSquared
            - 0.000000155 * timeQubed
            + 0.00033 * Math.sin(this.degreesToRadians(166.56 + 132.87 * time - 0.009173 * timeSquared));

        const sunMeanAnomaly = 359.2242 + 29.10535608 * moonTime - 0.0000333 * timeSquared - 0.00000347 * timeQubed;
        const moonMeanAnomaly = 306.0253 + 385.81691806 * moonTime + 0.0107306 * timeSquared + 0.00001236 * timeQubed;

        // Moon's argument of latitude
        const orbitalDistanceFactor = 21.2964 + 390.67050646 * moonTime - 0.0016528 * timeSquared - 0.00000239 * timeQubed;

        // Corrections for New and Full Moon
        if (phase0to1 < 0.01 || Math.abs(phase0to1 - 0.5) < 0.01) {
            moonPhaseMeanTime += (0.1734 - 0.000393 * time) * Math.sin(this.degreesToRadians(sunMeanAnomaly))
                + 0.0021 * Math.sin(this.degreesToRadians(2 * sunMeanAnomaly))
                - 0.4068 * Math.sin(this.degreesToRadians(moonMeanAnomaly))
                + 0.0161 * Math.sin(this.degreesToRadians(2 * moonMeanAnomaly))
                - 0.0004 * Math.sin(this.degreesToRadians(3 * moonMeanAnomaly))
                + 0.0104 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor))
                - 0.0051 * Math.sin(this.degreesToRadians(sunMeanAnomaly + moonMeanAnomaly))
                - 0.0074 * Math.sin(this.degreesToRadians(sunMeanAnomaly - moonMeanAnomaly))
                + 0.0004 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor + sunMeanAnomaly))
                - 0.0004 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor - sunMeanAnomaly))
                - 0.0006 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor + moonMeanAnomaly))
                + 0.0010 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor - moonMeanAnomaly))
                + 0.0005 * Math.sin(this.degreesToRadians(sunMeanAnomaly + 2 * moonMeanAnomaly));
            apcor = true;
        } else if (Math.abs(phase0to1 - 0.25) < 0.01 || Math.abs(phase0to1 - 0.75) < 0.01) {
            moonPhaseMeanTime += (0.1721 - 0.0004 * time) * Math.sin(this.degreesToRadians(sunMeanAnomaly))
                + 0.0021 * Math.sin(this.degreesToRadians(2 * sunMeanAnomaly))
                - 0.6280 * Math.sin(this.degreesToRadians(moonMeanAnomaly))
                + 0.0089 * Math.sin(this.degreesToRadians(2 * moonMeanAnomaly))
                - 0.0004 * Math.sin(this.degreesToRadians(3 * moonMeanAnomaly))
                + 0.0079 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor))
                - 0.0119 * Math.sin(this.degreesToRadians(sunMeanAnomaly + moonMeanAnomaly))
                - 0.0047 * Math.sin(this.degreesToRadians(sunMeanAnomaly - moonMeanAnomaly))
                + 0.0003 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor + sunMeanAnomaly))
                - 0.0004 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor - sunMeanAnomaly))
                - 0.0006 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor + moonMeanAnomaly))
                + 0.0021 * Math.sin(this.degreesToRadians(2 * orbitalDistanceFactor - moonMeanAnomaly))
                + 0.0003 * Math.sin(this.degreesToRadians(sunMeanAnomaly + 2 * moonMeanAnomaly))
                + 0.0004 * Math.sin(this.degreesToRadians(sunMeanAnomaly - 2 * moonMeanAnomaly))
                - 0.0003 * Math.sin(this.degreesToRadians(2 * sunMeanAnomaly + moonMeanAnomaly));

            // First and last quarter corrections
            if (phase0to1 < 0.5) {
                moonPhaseMeanTime += 0.0028 - 0.0004 * Math.cos(this.degreesToRadians(sunMeanAnomaly)) + 0.0003 * Math.cos(this.degreesToRadians(moonMeanAnomaly));
            } else {
                moonPhaseMeanTime += -0.0028 + 0.0004 * Math.cos(this.degreesToRadians(sunMeanAnomaly)) - 0.0003 * Math.cos(this.degreesToRadians(moonMeanAnomaly));
            }

            apcor = true;
        }

        return apcor ? moonPhaseMeanTime : null;
    }

    /**
     * Find time of phases of the moon which surround the current date. Five phases are found, starting and ending with the new moons which bound the current lunation.
     */
    phaseHunt() {
        const targetJulianDate = this.getJulianFromUTC(this.utcTimestamp);
        const searchTimestampMs = this.utcTimestamp - (this.dayInSeconds * 1000 * 45);
        const date = new Date(searchTimestampMs);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        let k1 = Math.floor((yy + ((moonMeanAnomaly - 1) * (1 / 12)) - 1900) * 12.3685);
        let nt1 = this.meanPhase(k1);
        adate = nt1;
        let k2;
        let x = 0
        while (x < 1000) {
            adate += this.synodicMonthDays;
            k2 = k1 + 1;
            let nt2 = this.meanPhase(k2);

            // If nt2 is close to sdate, then mean phase isn'time good enough, we have to be more accurate
            if (Math.abs(nt2 - sdate) < 0.75) {
                nt2 = this.truePhase(k2, 0.0);
            }

            if (nt1 <= sdate && nt2 > sdate) {
                break;
            }

            nt1 = nt2;
            k1 = k2;
            x++;
        }

        const datesJulian = [
            this.truePhase(k1, 0.0),
            this.truePhase(k1, 0.25),
            this.truePhase(k1, 0.5),
            this.truePhase(k1, 0.75),
            this.truePhase(k2, 0.0),
            this.truePhase(k2, 0.25),
            this.truePhase(k2, 0.5),
            this.truePhase(k2, 0.75),
        ];

        this.quarters = [];

        for (const jdate of datesJulian) {
            // Convert to UNIX time
            this.quarters.push((jdate - this.julianDateUnixEpoch) * (this.dayInSeconds));
        }
    }

    getJulianFromUTC(utcTimestamp) {
        return utcTimestamp / (this.dayInSeconds * 1000) + this.julianDateUnixEpoch;
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
