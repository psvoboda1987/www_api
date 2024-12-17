<?php

declare(strict_types = 1);

namespace App\Models;

use Dibi\Connection;
use Dibi\Fluent;

final class CitiesModel
{
    public const TABLE = 'address';

    public function __construct(private readonly Connection $db)
    {
    }

    public function getAllCities(): Fluent
    {
        return $this->db->select('city, zip')->from(self::TABLE);
    }
}