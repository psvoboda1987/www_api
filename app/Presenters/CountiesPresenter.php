<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\CountiesModel;
use Dibi\Connection;

final class CountiesPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly CountiesModel $countiesModel)
    {
        parent::__construct($db);
    }

    public const LIMIT = 1000;

    /*
     * GET counties
     * sort=ASC|DESC => orderBy('city')
     * zip=25162
     * city=Kladno
     * region=Praha
     * sort=ASC|DESC => orderBy('city')
     * limit=500
     */
    public function actionDefault(): void
    {
        $this->query = $this->countiesModel->getAllCounties();

        $this->addQueryFilter('zip');
        $this->addQueryFilter('city');
        $this->addQueryFilter('region');

        $this->setQuerySort();
        $this->setQueryLimit(self::LIMIT);
        $this->sendItemsResponse($this->query->fetchPairs(null, 'county'));
    }
}
