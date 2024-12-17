<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\MathModel;
use Dibi\Connection;
use Webmozart\Assert\Assert;

final class MathPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly MathModel $mathModel)
    {
        parent::__construct($db);
    }

    public function actionDefault(): void
    {
        dumpe('TODO: list of methods :-)');
    }

    // GET math/unique-letters?string=trytofinduniqueletters
    public function actionUniqueLetters(): void
    {
        $string = $this->getHttpRequest()->getQuery('string');
        Assert::notNull($string);
        $this->sendItemsResponse($this->mathModel->getUniqueLetters($string));
    }

    // GET math/vowel-counter?string=trytofinduniqueletters
    public function actionVowelCounter(): void
    {
        $string = $this->getHttpRequest()->getQuery('string');
        Assert::notNull($string);
        $this->sendItemsResponse($this->mathModel->getVowels($string));
    }

    // GET math/average-word-length?string=now%2C+try+to+find+unique+letters.+if+you+dare
    public function actionAverageWordLength(): void
    {
        $string = $this->getHttpRequest()->getQuery('string');
        Assert::notNull($string);
        $this->sendItemsResponse((array)$this->mathModel->getAverageWordLength($string));
    }

    // GET math/get-multiples?number=4&count=5
    public function actionGetMultiples(): void
    {
        $number = $this->getHttpRequest()->getQuery('number');
        $count = $this->getHttpRequest()->getQuery('count');
        Assert::notNull($number);
        Assert::notNull($count);
        $this->sendItemsResponse($this->mathModel->getMultiples((int)$count, (int)$number));
    }

    // GET math/is-prime-number?number=5
    public function actionIsPrimeNumber(): void
    {
        $number = $this->getHttpRequest()->getQuery('number');
        Assert::notNull($number);
        $this->sendItemsResponse((array)$this->mathModel->isPrimeNumber((int)$number));
    }

    // GET math/roman-number-to-integer?roman=MCMLXXVIII
    public function actionRomanNumberToInteger(): void
    {
        $string = $this->getHttpRequest()->getQuery('roman');
        Assert::notNull($string);
        $this->sendItemsResponse((array)$this->mathModel->getRomanToInt($string));
    }

    // GET math/prime-numbers?count=5
    public function actionPrimeNumbers(): void
    {
        $count = $this->getHttpRequest()->getQuery('count');
        $from = $this->getHttpRequest()->getQuery('from');
        Assert::notNull($count);
        Assert::notNull($from);
        $this->sendItemsResponse($this->mathModel->getPrimes((int)$from, (int)$count));
    }

    // GET math/fizzbuzz?number=20
    public function actionFizzbuzz(): void
    {
        $number = $this->getHttpRequest()->getQuery('number');
        Assert::notNull($number);
        $this->sendItemsResponse($this->mathModel->getFizzBuzzResult((int)$number));
    }

    // math/fibonacci-sequence?count=20
    public function actionFibonacciSequence(): void
    {
        $count = $this->getHttpRequest()->getQuery('count');
        Assert::notNull($count);
        $this->sendItemsResponse($this->mathModel->getFibonacciSequence((int)$count));
    }

    // math/fibonacci-value?number=20
    public function actionFibonacciValue(): void
    {
        $number = $this->getHttpRequest()->getQuery('number');
        Assert::notNull($number);
        $this->sendItemsResponse((array)$this->mathModel->getFibonacciValue((int)$number));
    }

    // GET math/sum?numbers=1,5,7,11,8,52,3&settings=even |odd|all
    public function actionSum(): void
    {
        $numbers = $this->getHttpRequest()->getQuery('numbers');
        Assert::notNull($numbers);
        $numbersParam = array_filter(explode(',', $numbers));
        $settings = $this->getHttpRequest()->getQuery('settings');
        $this->sendItemsResponse($this->mathModel->getItems($settings, $numbersParam));
    }

    // GET math/factors?number=12
    public function actionFactors(): void
    {
        $number = $this->getHttpRequest()->getQuery('number');
        Assert::notNull($number);
        $this->sendItemsResponse($this->mathModel->getFactors((int)$number));
    }

    // GET math/palindrome-check?word=lolipop -> false
    // GET math/palindrome-check?word=lolilol -> true
    public function actionPalindromeCheck(): void
    {
        $word = $this->getHttpRequest()->getQuery('word');
        Assert::notNull($word);
        $this->sendItemsResponse((array)$this->mathModel->isPalindrome($word));
    }
}
