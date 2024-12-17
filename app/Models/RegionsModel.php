<?php

declare(strict_types = 1);

namespace App\Models;

use Dibi\Connection;
use Dibi\Fluent;

final class RegionsModel
{
    public const TABLE = 'address';
    public const REGION = 'region';

    public function __construct(private readonly Connection $db)
    {
    }

    public function getAllCitiesCodes(): Fluent
    {
        return $this->db->select('city, zip')->from(self::TABLE);
    }

    public function getRegions(): Fluent
    {
        return $this->db->select()
            ->distinct(self::REGION)
            ->from(self::TABLE)
            ->orderBy(self::REGION);
    }
}