<?php

namespace App\Http\Controllers\Auth\ShikshaLevel;

use App\Application\ShikshaLevel\DTOs\SaveShikshaLevelData;
use App\Application\ShikshaLevel\DTOs\UpdateShikshaLevelData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ShikshaLevelApplicationService;
use App\Http\Requests\ShikshaLevel\ShikshaLevelRequest;
use App\Models\ShikshaLevel;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ShikshaLevelController extends Controller
{
    public function __construct(
        private readonly ShikshaLevelApplicationService $shikshaLevelApplicationService
    ) {
    }

    public function shikshalevel()
    {
        $list = $this->shikshaLevelApplicationService->list();
        return Inertia::render('SuperAdmin/shikshalevel', $list);
    }


    public function shikshalevelStore(ShikshaLevelRequest $request): RedirectResponse
    {
        $dto = SaveShikshaLevelData::fromArray($request->validated());
        $shikshalevelinfo = $this->shikshaLevelApplicationService->create($dto);
        ///dd($shikshalevelinfo);
        return redirect()->route('Action.ShikshaLevelStore')
            ->with('success', 'Exam Level Details Saved Successfully!')
            ->with('savedData', $shikshalevelinfo);
    }

    public function destroy($id)
    {
        //$education->delete();
        $shikshalevelinfo = $this->shikshaLevelApplicationService->delete($id);

        if ($shikshalevelinfo) {
            return redirect()->back()->with('success', 'Exam Level deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Exam Level not found or could not be deleted');
        }
    }

    public function update(ShikshaLevelRequest $request): RedirectResponse
    {
        $payload = array_merge($request->validated(), [
            'id' => (int) $request->input('id'),
        ]);
        $dto = UpdateShikshaLevelData::fromArray($payload);
        $this->shikshaLevelApplicationService->update($dto);

        return redirect()->route('Action.shikshalevel')->with('success', 'Exam Level updated successfully!');
    }

    public function edit(ShikshaLevel $shikshalevel)
    {
        return response()->json($shikshalevel);
    }

    public function view(ShikshaLevel $shikshalevel)
    {
        return response()->json($shikshalevel);
    }

}
