<?php

namespace App\Domain\Report\Contracts;

interface ReportRepositoryInterface
{
    public function allDevotee(): mixed;
    public function nextLevel(): mixed;
}
