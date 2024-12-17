<?php

declare(strict_types = 1);

namespace App\Models;

use Dibi\Connection;
use Dibi\Fluent;

final class DailyQuotesModel
{
    public const TABLE = 'quote_of_the_day';

    public function __construct(private readonly Connection $db)
    {
    }

    public function getRandom(): Fluent
    {
        return $this->db->select('*')
            ->from(self::TABLE)
            ->limit(1)
            ->orderBy('RAND()');
    }

    public function getAll(): Fluent
    {
        return $this->db->select('quote, author, category')->from(self::TABLE);
    }

    public function getAuthors(): Fluent
    {
        return $this->db->select()
            ->distinct('author')
            ->from(self::TABLE);
    }

    public function getCategories(): Fluent
    {
        return $this->db->select()
            ->distinct('category')
            ->from(self::TABLE);
    }
}