<?php

declare(strict_types = 1);

namespace unit;

use App\Models\ConvertModel;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../vendor/autoload.php';

final class ConvertTest extends TestCase
{
    private ConvertModel $convertModel;

    public function __construct($name = null)
    {
        parent::__construct($name);
        $this->convertModel = new ConvertModel;
    }

    public function testArray2Xml(): void
    {
        $xml = $this->convertModel->array2xml(['name' => 'Petr', 'age' => 35]);
        self::assertNotEmpty($xml);
        self::assertIsNotArray($xml);
    }

    public function testXml2Json(): void
    {
        $xml = $this->convertModel->array2xml(['name' => 'Petr', 'age' => 35]);
        $json = $this->convertModel->xml2json($xml);
        self::assertNotEmpty($json);
        self::assertIsString($json);
    }
}

