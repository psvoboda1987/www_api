<?php

declare(strict_types = 1);

namespace unit;

use App\Models\VowelsModel;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../vendor/autoload.php';

final class VowelsTest extends TestCase
{
    private readonly VowelsModel $vowelsModel;

    public function __construct($name = null)
    {
        parent::__construct($name);
        $this->vowelsModel = new VowelsModel;
    }

    public function testGetVowels(): void
    {
        self::assertSame(['e', 'i'], $this->vowelsModel->getVowels('test string'));
    }
}

