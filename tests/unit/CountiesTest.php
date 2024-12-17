<?php

declare(strict_types = 1);

namespace unit;

use App\Models\CountiesModel;
use Dibi\Connection;
use Nette\Neon\Neon;
use PHPUnit\Framework\TestCase;
use Webmozart\Assert\Assert;

require_once __DIR__ . '/../../vendor/autoload.php';

final class CountiesTest extends TestCase
{
    private CountiesModel $countiesModel;

    public function __construct($name = null)
    {
        parent::__construct($name);
        $config = file_get_contents(__DIR__ . '/../../config/local.neon');
        Assert::notFalse($config);
        $connection = new Connection(Neon::decode($config)['dibi']);
        $this->countiesModel = new CountiesModel($connection);
    }

    public function testData(): void
    {
        self::assertNotEmpty($this->countiesModel->getAllCounties());
    }
}

