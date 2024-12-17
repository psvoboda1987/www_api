<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\RegionsModel;
use Dibi\Connection;

final class PostalCodesPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly RegionsModel $regionsModel)
    {
        parent::__construct($db);
    }

    /*
     * GET postal-codes?city=Kladno
     * county=xy
     * region=Praha
     * sort=ASC|DESC => orderBy('city')
     * limit=500
     */
    public function actionDefault(): void
    {
        $this->query = $this->regionsModel->getAllCitiesCodes();

        $this->addQueryFilter('city');
        $this->addQueryFilter('county');
        $this->addQueryFilter('region');

        $this->setQuerySort();

        $this->setQueryLimit(1000);

        $this->sendItemsResponse($this->query->fetchPairs('city', 'zip'));
    }

    /*
     * GET postal-codes/validate/25162
     * city=Kladno
     */
    public function actionValidate(): void
    {
        $this->query = $this->regionsModel->getAllCitiesCodes();

        $this->addQueryFilter('city');

        if ($this->getParameter('id')) {
            $this->query->where(['zip' => $this->getParameter('id')]);
        }

        $this->sendItemsResponse($this->query->fetchPairs('city', 'zip'));
    }
}
