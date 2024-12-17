<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\DailyQuotesModel;
use Dibi\Connection;

final class DailyQuotesPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly DailyQuotesModel $dailyQuotesModel)
    {
        parent::__construct($db);
    }

    /*
     * GET daily-quotes/random
     * category=sports|life|funny|students|inspire|art|management|love
     * author=Dave%2C+Barry
     */
    public function actionRandom(): void
    {
        $this->query = $this->dailyQuotesModel->getRandom();

        $this->addQueryFilter('category');
        $this->addQueryFilter('author');

        $this->sendItemsResponse((array)$this->query->fetch());
    }

    /*
     * GET /daily-quotes?category=sports|life|funny|students|inspire|art|management|love
     * author=Dave%2C+Barry
     * limit=50
     */
    public function actionDefault(): void
    {
        $this->query = $this->dailyQuotesModel->getAll();

        $this->addQueryFilter('category');
        $this->addQueryFilter('author');
        $this->setQueryLimit();

        $this->sendItemsResponse($this->query->fetchAll());
    }

    /*
     * GET /daily-quotes/authors
     * limit=50
     */
    public function actionAuthors(): void
    {
        $this->query = $this->dailyQuotesModel->getAuthors();

        $this->setQueryLimit();

        $this->sendItemsResponse($this->query->fetchPairs(null, 'author'));
    }

    /*
     * GET daily-quotes/categories
     * limit=50
     */
    public function actionCategories(): void
    {
        $this->query = $this->dailyQuotesModel->getCategories();

        $this->setQueryLimit();

        $this->sendItemsResponse($this->query->fetchPairs(null, 'category'));
    }
}
