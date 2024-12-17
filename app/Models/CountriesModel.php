<?php

declare(strict_types = 1);

namespace App\Models;

use Dibi\Connection;
use Dibi\Fluent;

final class CountriesModel
{
    public const TABLE = 'country';

    public function __construct(private readonly Connection $db)
    {
    }

    public function getAllCountries(): Fluent
    {
        return $this->db->select('*')->from(self::TABLE);
    }
}