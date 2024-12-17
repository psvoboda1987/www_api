<?php

declare(strict_types = 1);

namespace App\Models;

final class VowelsModel
{
    public const VOWELS = ['a', 'e', 'i', 'o', 'u'];

    /**
     * @return array<int, string>
     */
    public function getVowels(string $string): array
    {
        $vowels = [];
        $strlen = strlen($string);

        for ($i = 0; $i < $strlen; $i++) {
            if (!in_array($string[$i], self::VOWELS, true)) {
                continue;
            }

            $vowels[] = $string[$i];
        }

        return $vowels;
    }
}