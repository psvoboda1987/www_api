<?php

declare(strict_types = 1);

namespace unit;

use App\Models\MathModel;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../vendor/autoload.php';

final class MathTest extends TestCase
{
    private readonly MathModel $mathModel;

    public function __construct($name = null)
    {
        parent::__construct($name);
        $this->mathModel = new MathModel();
    }

    public function testDividers(): void
    {
        self::assertSame([12, 6, 4, 3, 2, 1], $this->mathModel->getDividers(12));
    }

    public function testGetRomanToInt(): void
    {
        self::assertSame(1253, $this->mathModel->getRomanToInt('MCCLIII'));
    }

    public function testGetUniqueLetters(): void
    {
        self::assertSame(['h', 'e', 'l', 'o', ' ', 't', 's', 'r'], $this->mathModel->getUniqueLetters('hello testers'));
    }

    public function testGetVowelCounter(): void
    {
        self::assertSame(['e', 'o', 'e', 'e'], $this->mathModel->getVowels('hello testers'));
    }

    public function testGetMultiples(): void
    {
        self::assertSame([3,6,9,12], $this->mathModel->getMultiples(3,3));
    }

    public function testGetAverageWordLength(): void
    {
        self::assertSame(5, (int)$this->mathModel->getAverageWordLength('test string result'));
    }

    public function testGetFactors(): void
    {
        self::assertSame([1,3,9], $this->mathModel->getFactors(9));
    }

    public function testIsPalindrome(): void
    {
        self::assertFalse($this->mathModel->isPalindrome('lolipop'));
        self::assertTrue($this->mathModel->isPalindrome('lolilol'));
    }

    public function testGetEvenAndOdd(): void
    {
        self::assertSame([[1,3,4,5,6], 'sum' => 19], $this->mathModel->getEvenAndOdd([1,3,4,5,6]));
    }

    public function testGetItemsEven(): void
    {
        self::assertSame([[4,6], 'sum' => 10], $this->mathModel->getItemsEven([1,3,4,5,6]));
    }

    public function testGetItemsOdd(): void
    {
        self::assertSame([[1,3,5], 'sum' => 9], $this->mathModel->getItemsOdd([1,3,4,5,6]));
    }

    public function testGetFibonacciSequence(): void
    {
        self::assertSame([0,1,1,2,3], $this->mathModel->getFibonacciSequence(5));
    }

    public function testGetFibonacciValue(): void
    {
        self::assertSame(3, $this->mathModel->getFibonacciValue(5));
    }

    public function testGetFizzBuzzResult(): void
    {
        self::assertSame([0,1,2,'fizz'], $this->mathModel->getFizzBuzzResult(3));
    }

    public function testGetFizzbuzzFromNumber(): void
    {
        self::assertSame('fizz', $this->mathModel->getFizzbuzzFromNumber(3));
        self::assertSame(4, $this->mathModel->getFizzbuzzFromNumber(4));
        self::assertSame('buzz', $this->mathModel->getFizzbuzzFromNumber(5));
    }

    public function testGetPrimes(): void
    {
        self::assertSame([11,13,17], $this->mathModel->getPrimes(10,3));
    }

    public function testIsPrimeNumber(): void
    {
        self::assertTrue($this->mathModel->isPrimeNumber(13));
        self::assertFalse($this->mathModel->isPrimeNumber(12));
    }
}

