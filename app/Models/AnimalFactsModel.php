<?php

declare(strict_types = 1);

namespace App\Models;

use Dibi\Connection;
use Dibi\Fluent;

final class AnimalFactsModel
{
    public const TABLE = 'animal_fact';

    public function __construct(private readonly Connection $db)
    {
    }

    public function getAll(): Fluent
    {
        return $this->db->select('*')->from(self::TABLE);
    }

    public function getRandomAnimal(): Fluent
    {
        return $this->db->select('*')
            ->from(self::TABLE)
            ->orderBy('RAND()')
            ->limit(1);
    }
}