<?php

declare(strict_types = 1);

namespace unit;

use App\Models\DailyQuotesModel;
use Dibi\Connection;
use Nette\Neon\Neon;
use PHPUnit\Framework\TestCase;
use Webmozart\Assert\Assert;

require_once __DIR__ . '/../../vendor/autoload.php';

final class DailyQuotesTest extends TestCase
{
    private DailyQuotesModel $dailyQuotesModel;

    public function __construct($name = null)
    {
        parent::__construct($name);
        $config = file_get_contents(__DIR__ . '/../../config/local.neon');
        Assert::notFalse($config);
        $connection = new Connection(Neon::decode($config)['dibi']);
        $this->dailyQuotesModel = new DailyQuotesModel($connection);
    }

    public function testData(): void
    {
        self::assertNotEmpty($this->dailyQuotesModel->getCategories()->fetchAll());
        self::assertNotEmpty($this->dailyQuotesModel->getAuthors()->fetchAll());
        self::assertNotEmpty($this->dailyQuotesModel->getRandom()->fetchAll());
        self::assertNotEmpty($this->dailyQuotesModel->getAll()->fetchAll());
    }
}

