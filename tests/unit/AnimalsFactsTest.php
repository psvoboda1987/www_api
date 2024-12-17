<?php

declare(strict_types = 1);

namespace unit;

use App\Models\AnimalFactsModel;
use Dibi\Connection;
use Nette\Neon\Neon;
use PHPUnit\Framework\TestCase;
use Webmozart\Assert\Assert;

require_once __DIR__ . '/../../vendor/autoload.php';

final class AnimalsFactsTest extends TestCase
{
    private AnimalFactsModel $animalFactsModel;

    public function __construct($name = null)
    {
        parent::__construct($name);
        $config = file_get_contents(__DIR__ . '/../../config/local.neon');
        Assert::notFalse($config);
        $connection = new Connection(Neon::decode($config)['dibi']);
        $this->animalFactsModel = new AnimalFactsModel($connection);
    }

    public function testData(): void
    {
        $this->assertNotEmpty($this->animalFactsModel->getRandomAnimal()->fetchAll());
        $this->assertNotEmpty($this->animalFactsModel->getAll()->fetchAll());
    }
}

