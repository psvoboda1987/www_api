<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\VowelsModel;
use Dibi\Connection;
use Webmozart\Assert\Assert;

final class WordsPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly VowelsModel $vowelsModel)
    {
        parent::__construct($db);
    }

    // GET words/vowel-count?string=testingonastring
    public function actionVowelCount(): void
    {
        $string = $this->getHttpRequest()->getQuery('string');
        Assert::notNull($string);

        $vowels = $this->vowelsModel->getVowels($string);

        $this->sendItemsResponse($vowels);
    }
}