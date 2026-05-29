export default class MoonPhase {
    constructor(date = null) {
        date = date === null ? new Date().getTime() : date.getTime();
        this.timestamp = date;

        // Astronomical constants. 1980 January 0.0
        const epoch = 2_444_238.5;
        // Constants defining the Sun's apparent orbit
        // Ecliptic longitude of the Sun at epoch 1980.0
        const elonge = 278.833540;

        // Ecliptic longitude of the Sun at perigee
        const elongp = 282.596403;

        // Eccentricity of Earth's orbit
        const eccent = 0.016718;

        // Semi-major axis of Earth's orbit, km
        const sunsmax = 1.495985e8;

        // Sun's angular size, degrees, at semi-major axis distance
        const sunangsiz = 0.533128;

        // Elements of the Moon's orbit, epoch 1980.0

        // Moon's mean longitude at the epoch
        const mmlong = 64.975464;

        // Mean longitude of the perigee at the epoch
        const mmlongp = 349.383063;

        // Eccentricity of the Moon's orbit
        const mecc = 0.054900;

        // Moon's angular size at distance a from Earth
        const mangsiz = 0.5181;

        // Semi-major axis of Moon's orbit in km
        const msmax = 384401;

        // Synodic month (new Moon to new Moon)
        const synmonth = 29.53058868;

        this.synmonth = synmonth;

        // date is coming in as a UNIX timstamp in milliseconds, so convert it to Julian
        date = date / 86_400_000 + 2_440_587.5;

        // Calculation of the Sun's position

        // Date within epoch
        const day = date - epoch;

        // Mean anomaly of the Sun
        const n = this.fixAngle((360 / 365.2422) * day);

        // Convert from perigee co-ordinates to epoch 1980.0
        const m = this.fixAngle(n + elonge - elongp);

        // Solve equation of Kepler
        let ec = this.kepler(m, eccent);
        ec = Math.sqrt((1 + eccent) / (1 - eccent)) * Math.tan(ec / 2);

        // True anomaly
        ec = 2 * this.radiansToDegrees(Math.atan(ec));

        // Sun's geocentric ecliptic longitude
        const lambdaSun = this.fixAngle(ec + elongp);

        // Orbital distance factor
        const f = ((1 + eccent * Math.cos(this.degreesToRadians(ec))) / (1 - eccent * eccent));

        // Distance to Sun in km
        const sunDist = sunsmax / f;

        // Sun's angular size in degrees
        const sunAng = f * sunangsiz;

        // Calculation of the Moon's position

        // Moon's mean longitude
        const ml = this.fixAngle(13.1763966 * day + mmlong);

        // Moon's mean anomaly
        const mm = this.fixAngle(ml - 0.1114041 * day - mmlongp);

        const evection = 1.2739 * Math.sin(this.degreesToRadians(2 * (ml - lambdaSun) - mm));

        const annualEquation = 0.1858 * Math.sin(this.degreesToRadians(m));

        // Correction term
        const a3 = 0.37 * Math.sin(this.degreesToRadians(m));

        // Corrected anomaly
        const mmp = mm + evection - annualEquation - a3;

        // Correction for the equation of the centre
        const mEc = 6.2886 * Math.sin(this.degreesToRadians(mmp));

        // Another correction term
        const a4 = 0.214 * Math.sin(this.degreesToRadians(2 * mmp));

        // Corrected longitude
        const lP = ml + evection + mEc - annualEquation + a4;

        const variation = 0.6583 * Math.sin(this.degreesToRadians(2 * (lP - lambdaSun)));

        // True longitude
        const lPP = lP + variation;

        // Calculation of the phase of the Moon

        // Age of the Moon in degrees
        const moonAge = lPP - lambdaSun;

        // Phase of the Moon
        const moonPhase = (1 - Math.cos(this.degreesToRadians(moonAge))) / 2;

        // Distance of moon from the centre of the Earth
        const moonDist = (msmax * (1 - mecc * mecc)) / (1 + mecc * Math.cos(this.degreesToRadians(mmp + mEc)));

        const moonDFrac = moonDist / msmax;

        // Moon's angular diameter
        const moonAng = mangsiz / moonDFrac;

        // Store results

        // Phase (0 to 1)
        this.phase = this.fixAngle(moonAge) / 360;

        // Illuminated fraction (0 to 1)
        this.illumination = moonPhase;

        // Age of moon (days)
        this.age = synmonth * this.phase;

        // Distance (kilometres)
        this.distance = moonDist;

        // Angular diameter (degrees)
        this.diameter = moonAng;

        // Age of the Moon in degrees
        this.ageDegrees = moonAge;

        // Distance to Sun (kilometres)
        this.sunDistance = sunDist;

        // Sun's angular diameter (degrees)
        this.sunDiameter = sunAng;
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

    kepler(m, ecc) {
        // 1E-6
        const epsilon = 0.000001;
        let e = m = this.degreesToRadians(m);

        while (true) {
            const delta = e - ecc * Math.sin(e) - m;
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
    meanPhase(k) {
        // Time in Julian centuries from 1900 January 0.5
        const jt = 2_415_020.0 / 36525;
        const t2 = jt * jt;
        const t3 = t2 * jt;

        return 2_415_020.75933 + this.synmonth * k
            + 0.0001178 * t2
            - 0.000000155 * t3
            + 0.00033 * Math.sin(this.degreesToRadians(166.56 + 132.87 * jt - 0.009173 * t2));
    }

    /**
     * Given a K value used to determine the mean phase of the new moon and a phase selector (0.0, 0.25, 0.5, 0.75), obtain the true, corrected phase time.
     */
    truePhase(k, phase) {
        let apcor = false;

        // Add phase to new moon time
        k += phase;

        // Time in Julian centuries from 1900 January 0.5
        const t = k / 1236.85;

        // Square for frequent use
        const t2 = t * t;

        // Cube for frequent use
        const t3 = t2 * t;

        // Mean time of phase
        let pt = 2_415_020.75933
            + this.synmonth * k
            + 0.0001178 * t2
            - 0.000000155 * t3
            + 0.00033 * Math.sin(this.degreesToRadians(166.56 + 132.87 * t - 0.009173 * t2));

        // Sun's mean anomaly
        const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;

        // Moon's mean anomaly
        const mprime = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;

        // Moon's argument of latitude
        const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;

        if (phase < 0.01 || Math.abs(phase - 0.5) < 0.01) {
            // Corrections for New and Full Moon
            pt += (0.1734 - 0.000393 * t) * Math.sin(this.degreesToRadians(m))
                + 0.0021 * Math.sin(this.degreesToRadians(2 * m))
                - 0.4068 * Math.sin(this.degreesToRadians(mprime))
                + 0.0161 * Math.sin(this.degreesToRadians(2 * mprime))
                - 0.0004 * Math.sin(this.degreesToRadians(3 * mprime))
                + 0.0104 * Math.sin(this.degreesToRadians(2 * f))
                - 0.0051 * Math.sin(this.degreesToRadians(m + mprime))
                - 0.0074 * Math.sin(this.degreesToRadians(m - mprime))
                + 0.0004 * Math.sin(this.degreesToRadians(2 * f + m))
                - 0.0004 * Math.sin(this.degreesToRadians(2 * f - m))
                - 0.0006 * Math.sin(this.degreesToRadians(2 * f + mprime))
                + 0.0010 * Math.sin(this.degreesToRadians(2 * f - mprime))
                + 0.0005 * Math.sin(this.degreesToRadians(m + 2 * mprime));

            apcor = true;
        } else if (Math.abs(phase - 0.25) < 0.01 || Math.abs(phase - 0.75) < 0.01) {
            pt += (0.1721 - 0.0004 * t) * Math.sin(this.degreesToRadians(m))
                + 0.0021 * Math.sin(this.degreesToRadians(2 * m))
                - 0.6280 * Math.sin(this.degreesToRadians(mprime))
                + 0.0089 * Math.sin(this.degreesToRadians(2 * mprime))
                - 0.0004 * Math.sin(this.degreesToRadians(3 * mprime))
                + 0.0079 * Math.sin(this.degreesToRadians(2 * f))
                - 0.0119 * Math.sin(this.degreesToRadians(m + mprime))
                - 0.0047 * Math.sin(this.degreesToRadians(m - mprime))
                + 0.0003 * Math.sin(this.degreesToRadians(2 * f + m))
                - 0.0004 * Math.sin(this.degreesToRadians(2 * f - m))
                - 0.0006 * Math.sin(this.degreesToRadians(2 * f + mprime))
                + 0.0021 * Math.sin(this.degreesToRadians(2 * f - mprime))
                + 0.0003 * Math.sin(this.degreesToRadians(m + 2 * mprime))
                + 0.0004 * Math.sin(this.degreesToRadians(m - 2 * mprime))
                - 0.0003 * Math.sin(this.degreesToRadians(2 * m + mprime));

            // First and last quarter corrections
            if (phase < 0.5) {
                pt += 0.0028 - 0.0004 * Math.cos(this.degreesToRadians(m)) + 0.0003 * Math.cos(this.degreesToRadians(mprime));
            } else {
                pt += -0.0028 + 0.0004 * Math.cos(this.degreesToRadians(m)) - 0.0003 * Math.cos(this.degreesToRadians(mprime));
            }

            apcor = true;
        }

        return apcor ? pt : null;
    }

    /**
     * Find time of phases of the moon which surround the current date. Five phases are found, starting and ending with the new moons which bound the current lunation.
     */
    phaseHunt() {
        const sdate = this.getJulianFromUTC(this.timestamp);
        let adate = sdate - 45;
        const ats = this.timestamp - (86_400_000 * 45);
        const date = new Date(ats);
        const yy = date.getFullYear();
        const mm = date.getMonth() + 1;

        let k1 = Math.floor((yy + ((mm - 1) * (1 / 12)) - 1900) * 12.3685);
        let nt1 = this.meanPhase(k1);
        adate = nt1;
        let k2;
        let x = 0
        while (x < 1000) {
            adate += this.synmonth;
            k2 = k1 + 1;
            let nt2 = this.meanPhase(k2);

            // If nt2 is close to sdate, then mean phase isn't good enough, we have to be more accurate
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

        // Results in Julian dates
        const dates = [
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

        for (const jdate of dates) {
            // Convert to UNIX time
            this.quarters.push((jdate - 2_440_587.5) * 86_400);
        }
    }

    // UTC to Julian
    getJulianFromUTC(timestamp) {
        return timestamp / 86_400_000 + 2_440_587.5;
    }

    getPhase() {
        return this.phase;
    }

    getIllumination() {
        return this.illumination;
    }

    getAge() {
        return this.age;
    }

    getDistance() {
        return this.distance;
    }

    getDiameter() {
        return this.diameter;
    }

    getSunDistance() {
        return this.sunDistance;
    }

    getSunDiameter() {
        return this.sunDiameter;
    }

    // Get moon phase data
    getPhaseByName(name) {
        const phases = [
            'new_moon',
            'first_quarter',
            'full_moon',
            'last_quarter',
            'next_new_moon',
            'next_first_quarter',
            'next_full_moon',
            'next_last_quarter',
        ];

        if (typeof this.quarters === 'undefined') {
            this.phaseHunt();
        }

        // Bezpečné vyhledání indexu bez mutace pole pomocí .reverse()
        const index = phases.indexOf(name);

        return index !== -1 ? this.quarters[index] : null;
    }

    /**
     * Get current phase name. There are eight phases, evenly split.
     * A "New Moon" occupies the 1/16th phases either side of phase = 0, and the rest follow from that.
     */
    getPhaseName() {
        const names = [
            'New Moon',
            'Waxing Crescent',
            'First Quarter',
            'Waxing Gibbous',
            'Full Moon',
            'Waning Gibbous',
            'Third Quarter',
            'Waning Crescent',
        ];

        // % 8 prevents array overflow
        const index = Math.floor((this.phase + 0.0625) * 8) % 8;

        return names[index];
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
