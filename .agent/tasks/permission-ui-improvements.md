# Permission UI Improvements

## Objective
Refine the permission list display to ensure consistent layout, proper naming conventions, and clear action labels.

## Requirements
1. **Equal Height Cards**: All permission cards in the same row should have the same height
2. **PascalCase Formatting**: Module names and permission labels should display in proper PascalCase (e.g., "StartDevoteeRegistration")
3. **Clear Action Labels**: Technical permission names like "Shikshalevelstore" should display as simple actions like "Create"

## Implementation Steps

### 1. Fix Card Height Consistency
- Add `height: 100%` to card styles
- Ensure grid layout uses proper flex/grid properties for equal heights

### 2. Improve PascalCase Conversion
- Enhance the `toPascalCase` function to handle compound words better
- Convert "devoteeregistration" → "DevoteeRegistration"
- Convert "shikshalevel" → "ShikshaLevel"

### 3. Refine Permission Label Display
- Update `getPermissionLabel` function to prioritize action names
- Map technical permissions to user-friendly labels
- Ensure all permission types show clear, concise action names

## Files to Modify
- `e:\RiteshWork\ShkonProjectWithPermission\resources\js\Components\organisms\Dashboard\SuperAdminDashboard\ShikshaAppUser\ShikshaAppUser.tsx`

## Expected Outcome
- Professional, consistent grid layout with equal-height cards
- All text in proper PascalCase format
- Clear, understandable permission labels
