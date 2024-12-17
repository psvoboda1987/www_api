<?php

declare(strict_types = 1);

namespace App\Models;

use DateTime;
use Dibi\Connection;
use Dibi\Fluent;
use Faker\Factory;
use Faker\Generator;

final class LoremModel
{
    public const TABLE = 'lorem_ipsum';
    private Generator $generator;

    public function __construct(private readonly Connection $db, Factory $factory)
    {
        $this->generator = $factory::create();
    }

    public function getLoremIpsum(): Fluent
    {
        return $this->db->select('*')->from(self::TABLE);
    }

    public function getFakeData(?string $type): float|DateTime|array|string
    {
        return match ($type) {
            'buildingNumber' => $this->generator->buildingNumber(),
            'citySuffix' => $this->generator->citySuffix(),
            'city' => $this->generator->city(),
            'streetSuffix' => $this->generator->streetSuffix(),
            'streetName' => $this->generator->streetName(),
            'streetAddress' => $this->generator->streetAddress(),
            'postcode' => $this->generator->postcode(),
            'address' => $this->generator->address(),
            'country' => $this->generator->country(),
            'latitude' => $this->generator->latitude(),
            'longitude' => $this->generator->longitude(),
            'localCoordinates' => $this->generator->localCoordinates(),
            'randomDigitNotNull' => $this->generator->randomDigitNotNull(),
            'randomLetter' => $this->generator->randomLetter(),
            'randomAscii' => $this->generator->randomAscii(),
            'randomElements' => $this->generator->randomElements(),
            'randomElement' => $this->generator->randomElement(),
            'randomKey' => $this->generator->randomKey(),
            'hexColor' => $this->generator->hexColor(),
            'rgbColor' => $this->generator->rgbColor(),
            'colorName' => $this->generator->colorName(),
            'hslColor' => $this->generator->hslColor(),
            'company' => $this->generator->company(),
            'companySuffix' => $this->generator->companySuffix(),
            'jobTitle' => $this->generator->jobTitle(),
            'unixTime' => $this->generator->unixTime(),
            'date' => $this->generator->date(),
            'time' => $this->generator->time(),
            'dateTimeInInterval' => $this->generator->dateTimeInInterval(),
            'dateTimeThisCentury' => $this->generator->dateTimeThisCentury(),
            'dateTimeThisDecade' => $this->generator->dateTimeThisDecade(),
            'dateTimeThisYear' => $this->generator->dateTimeThisYear(),
            'dateTimeThisMonth' => $this->generator->dateTimeThisMonth(),
            'amPm' => $this->generator->amPm(),
            'dayOfMonth' => $this->generator->dayOfMonth(),
            'dayOfWeek' => $this->generator->dayOfWeek(),
            'month' => $this->generator->month(),
            'monthName' => $this->generator->monthName(),
            'year' => $this->generator->year(),
            'century' => $this->generator->century(),
            'randomHtml' => $this->generator->randomHtml(),
            'safeEmail' => $this->generator->safeEmail(),
            'companyEmail' => $this->generator->companyEmail(),
            'safeEmailDomain' => $this->generator->safeEmailDomain(),
            'userName' => $this->generator->userName(),
            'password' => $this->generator->password(),
            'url' => $this->generator->url(),
            'ipv4' => $this->generator->ipv4(),
            'localIpv4' => $this->generator->localIpv4(),
            'macAddress' => $this->generator->macAddress(),
            'word' => $this->generator->word(),
            'words' => $this->generator->words(),
            'sentence' => $this->generator->sentence(),
            'sentences' => $this->generator->sentences(),
            'md5' => $this->generator->md5(),
            'locale' => $this->generator->locale(),
            'countryCode' => $this->generator->countryCode(),
            'languageCode' => $this->generator->languageCode(),
            'currencyCode' => $this->generator->currencyCode(),
            'emoji' => $this->generator->emoji(),
            'creditCardType' => $this->generator->creditCardType(),
            'creditCardNumber' => $this->generator->creditCardNumber(),
            'creditCardExpirationDateString' => $this->generator->creditCardExpirationDateString(),
            'creditCardDetails' => $this->generator->creditCardDetails(),
            'iban' => $this->generator->iban(),
            'swiftBicNumber' => $this->generator->swiftBicNumber(),
            'firstName' => $this->generator->firstName(),
            'firstNameMale' => $this->generator->firstNameMale(),
            'firstNameFemale' => $this->generator->firstNameFemale(),
            'lastName' => $this->generator->lastName(),
            'phoneNumber' => $this->generator->phoneNumber(),
            default => $this->generator->name(),
        };
    }
}