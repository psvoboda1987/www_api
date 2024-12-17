<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\ValidationsModel;
use Dibi\Connection;
use Webmozart\Assert\Assert;

final class ValidationsPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly ValidationsModel $validationsModel)
    {
        parent::__construct($db);
    }

    public function actionDefault(): void
    {
        dumpe('TODO: list of methods :-)');
    }

    // GET validations/email/petr.svoboda@ipsos.com
    public function actionEmail(): void
    {
        $email = $this->getParameter('id');
        Assert::notNull($email);

        if ($this->validationsModel->isEmailValid($email)) {
            $this->sendItemsResponse([$email => true]);
        }

        $this->sendItemsResponse([]);
    }

    // GET validations/company-number/45677856 // false
    // GET validations/company-number/06501524 // true
    public function actionCompanyNumber(): void
    {
        $cin = $this->getParameter('id');
        Assert::notNull($cin);

        if ($this->validationsModel->validateCIN($cin)) {
            $this->sendItemsResponse([$cin => true]);
        }

        $this->sendItemsResponse([]);
    }

    // GET validations/birth-number/8708050791
    public function actionBirthNumber(): void
    {
        $pin = $this->getParameter('id');
        Assert::notNull($pin);

        if ($this->validationsModel->validatePin($pin)) {
            $this->sendItemsResponse([$pin => true]);
        }

        $this->sendItemsResponse([]);
    }
}
