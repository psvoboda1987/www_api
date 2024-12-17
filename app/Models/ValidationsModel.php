<?php

declare(strict_types = 1);

namespace App\Models;

use Egulias\EmailValidator\EmailValidator;
use Egulias\EmailValidator\Validation\RFCValidation;

final class ValidationsModel
{
    public function __construct(
        private readonly EmailValidator $emailValidator,
        private readonly RFCValidation $rfcValidation,
    )
    {
    }

    public function isEmailValid(string $email): bool
    {
        return $this->emailValidator->isValid($email, $this->rfcValidation);
    }

    public function validatePin(string $pin): bool
    {
        if (!preg_match('#^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$#', $pin, $matches)) {
            return false;
        }

        [, $year, $month, $day, $ext, $c] = $matches;

        if ($c === '') {
            $year += $year < 54 ? 1900 : 1800;
            return checkdate(
                $this->getMonth($month, $year), (int)$day, $year
            );
        }

        $controlEntity = ($year . $month . $day . $ext) % 11;

        if ($controlEntity === 10) {
            $controlEntity = 0;
        }

        if ($controlEntity !== (int)$c) {
            return false;
        }

        $year += $year < 54 ? 2000 : 1900;

        return checkdate((int)$this->getMonth($month, $year), (int)$day, (int)$year);
    }

    private function getMonth(int|string $month, int|string $year): int|string
    {
        // k měsíci může být připočteno 20, 50 nebo 70
        if ($month > 70 && $year > 2003) {
            $month -= 70;
            return $month;
        }

        if ($month > 50) {
            $month -= 50;
            return $month;
        }

        if ($month > 20 && $year > 2003) {
            $month -= 20;
            return $month;
        }

        return $month;
    }

    public function validateCIN(string $cin): bool
    {
        $cin = preg_replace('#\s+#', '', $cin);

        if (!preg_match('#^\d{8}$#', $cin)) {
            return false;
        }

        $check = 0;

        for ($i = 0; $i < 7; $i++) {
            $check += (int)$cin[$i] * (8 - $i);
        }

        $check %= 11;

        if ($check === 0) {
            return (int)$cin[7] === 1;
        }

        if ($check === 1) {
            return (int)$cin[7] === 0;
        }

        return (int)$cin[7] === 11 - $check;
    }
}