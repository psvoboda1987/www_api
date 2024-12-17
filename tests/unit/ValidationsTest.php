<?php

declare(strict_types = 1);

namespace unit;

use App\Models\ValidationsModel;
use Egulias\EmailValidator\EmailValidator;
use Egulias\EmailValidator\Validation\RFCValidation;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../vendor/autoload.php';

final class ValidationsTest extends TestCase
{
    private ValidationsModel $validationsModel;

    public function __construct($name = null)
    {
        parent::__construct($name);
        $this->validationsModel = new ValidationsModel(
            new EmailValidator(),
            new RFCValidation(),
        );
    }

    public function testEmailValid(): void
    {
        self::assertTrue($this->validationsModel->isEmailValid('psvoboda1987@gmail.com'));
    }

    public function testPinValid(): void
    {
        self::assertTrue($this->validationsModel->validatePin('8607060355'));
    }

    public function testCinValid(): void
    {
        self::assertTrue($this->validationsModel->validateCIN('06501524'));
        self::assertFalse($this->validationsModel->validateCIN('45677856'));
    }
}

