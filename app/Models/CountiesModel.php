<?php

declare(strict_types = 1);

namespace App\Models;

use Dibi\Connection;
use Dibi\Fluent;

final class CountiesModel
{
    public const TABLE = 'address';

    public function __construct(private readonly Connection $db)
    {
    }

    public function getAllCounties(): Fluent
    {
        return $this->db->select()
            ->distinct('county')
            ->from(self::TABLE)
            ->orderBy('county');
    }
}