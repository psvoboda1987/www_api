<?php

declare(strict_types = 1);

namespace App\Presenters;

use Dibi\Connection;
use Solaris\MoonPhase;

final class MoonPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly MoonPhase $moonPhase)
    {
        parent::__construct($db);
    }

    // GET moon/phase
    public function actionPhase(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhase()]);
    }

    // GET moon/phase-name
    public function actionPhaseName(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhaseName()]);
    }

    // GET moon/age-in-days
    public function actionAgeInDays(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getAge()]);
    }

    // GET moon/earth-distance-in-km
    public function actionEarthDistanceInKm(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getDistance()]);
    }

    // GET moon/sun-distance-in-km
    public function actionSunDistanceInKm(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getSunDistance()]);
    }

    // GET moon/illuminated-fraction
    public function actionIlluminatedFraction(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getIllumination()]);
    }

    // GET moon/next-first-quarter
    public function actionNextFirstQuarter(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhaseNextFirstQuarter()]);
    }

    // GET moon/previous-last-quarter
    public function actionPreviousLastQuarter(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhaseLastQuarter()]);
    }

    // GET moon/next-full-moon
    public function actionNextFullMoon(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhaseNextFullMoon()]);
    }

    // GET moon/full-moon
    public function actionFullMoon(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhaseFullMoon()]);
    }

    // GET moon/next-new-moon
    public function actionNextNewMoon(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhaseNextNewMoon()]);
    }

    // GET moon/new-moon
    public function actionNewMoon(): void
    {
        $this->sendItemsResponse([$this->moonPhase->getPhaseNewMoon()]);
    }

    public function actionDefault(): void
    {
        dumpe('TODO: list of methods :-)');
    }
}
