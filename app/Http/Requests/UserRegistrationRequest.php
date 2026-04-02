<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set to true if no authorization logic is needed, otherwise implement your logic
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $resumableUser = $this->findResumableUser();

        $contactRules = ['required', 'string', 'min:10', 'max:15', 'regex:/^[1-9][0-9]{9,14}$/'];
        $emailRules = ['required', 'email', 'regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i'];

        // Only apply unique validation if relation_type is 'self'
        if ($this->input('relation_type') === 'self') {
            $contactUnique = Rule::unique('users', 'contact_number');
            if ($resumableUser) {
                $contactUnique->ignore($resumableUser->id);
            }
            $contactRules[] = $contactUnique;
        }

        $emailUnique = Rule::unique('users', 'email');
        if ($resumableUser) {
            $emailUnique->ignore($resumableUser->id);
        }
        $emailRules[] = $emailUnique;

        $rules = [
            'email' => $emailRules,
            'name' => 'required|string|max:255',
            'Initiated_name' => 'nullable|string|max:255',
            'dob' => 'required|date|before:today|after_or_equal:1900-01-01',
            'contact_number' => $contactRules,
            'have_you_applied_before' => 'required',
            'devotee_type' => 'required',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
            'relation_type' => 'required|in:self,relative',
            'relative_login_id' => 'nullable|string|max:50',
            'unique_user_check' => [
                'required',
                function ($attribute, $value, $fail) {
                    // Only check for duplicate users if relation_type is 'self'
                    if ($this->input('relation_type') === 'self') {
                        if (
                            User::where('email', $this->input('email'))
                                ->where('contact_number', $this->input('contact_number'))
                                ->where(function ($q) {
                                    $q->where('profile_submitted', 'Y')
                                        ->orWhere('account_approved', 'A');
                                })
                                ->exists()
                        ) {
                            $fail('A user with the same email and contact number has already registered.');
                        }
                    }
                }
            ],
            // One-time complete profile fields
            'Educational' => 'required|integer|exists:education,id',
            'MaritalStatus' => 'required|integer|exists:merital_status,id',
            'Profession' => 'required|integer|exists:profession,id',
            'SpiritualMaster' => 'required|string|max:255',
            'JoinedSckon' => 'required|date|before_or_equal:today|after_or_equal:1900-01-01',
            'CurrentAddress' => 'required|string|max:255',
            'Socity_Name' => 'nullable|string|max:255',
            'Sector_Area' => 'nullable|string|max:255',
            'Pincode' => 'required|digits:6',
            'State' => 'required',
            'District' => 'required',
            'NoOfChant' => 'nullable|integer|min:0|max:999',
            'ChantingStartDate' => 'nullable|date|before_or_equal:today|after_or_equal:1900-01-01',
            'SpendTimeHearingLecture' => 'nullable|string|max:255',
            'ShastriDegree' => 'nullable|string|max:255',
            'since_when_you_attending_ashray_classes' => 'nullable|date|before_or_equal:today|after_or_equal:1900-01-01',
            'spiritual_master_you_aspiring' => 'nullable|string|max:255',
            'ashray_leader_code' => 'required',
            'Bhakti_BhikshukId' => 'nullable',
            'RegulativePrinciples' => 'nullable|array',
            'RegulativePrinciples.*' => 'integer|exists:regulative_principle,id',
            'BooksRead' => 'nullable|array',
            'BooksRead.*' => 'integer|exists:book,id',
            'MemorisedPrayers' => 'nullable|array',
            'MemorisedPrayers.*' => 'integer|exists:prayer,id',
            'Seminar' => 'nullable|array',
            'Seminar.*' => 'integer|exists:seminar,id',
        ];

        if ($this->input('relation_type') === 'relative') {
            $rules['relative_login_id'] = [
                'required',
                function ($attribute, $value, $fail) {
                    if (!User::where('login_id', $value)->exists()) {
                        $fail('The specified Login ID does not exist in our database.');
                    }
                }
            ];
        }

        return $rules;
    }

    private function findResumableUser(): ?User
    {
        $email = trim((string) $this->input('email', ''));
        $contact = preg_replace('/\D/', '', (string) $this->input('contact_number', ''));
        if ($email === '' || $contact === '') {
            return null;
        }

        return User::query()
            ->where('email', $email)
            ->where('contact_number', $contact)
            ->where('devotee_type', 'AD')
            ->where(function ($q) {
                $q->whereNull('profile_submitted')
                    ->orWhere('profile_submitted', '!=', 'Y');
            })
            ->where(function ($q) {
                $q->whereNull('account_approved')
                    ->orWhereIn('account_approved', ['N', 'R']);
            })
            ->orderByDesc('id')
            ->first();
    }


    /**
     * Customize the validated data.
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default); // Call the parent method with the same signature

        // If no specific key is requested, remove the 'unique_user_check' field from the validated data
        if (is_null($key)) {
            unset($validated['unique_user_check']);
        }

        return $validated;
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'email.regex' => 'Only Gmail addresses are allowed.',

            'name.required' => 'Full name is required.',
            'name.string' => 'Full name must be a valid string.',
            'name.max' => 'Full name cannot be longer than 255 characters.',

            'Initiated_name.required' => 'Initiated name is required.',
            'Initiated_name.string' => 'Initiated name must be a valid string.',
            'Initiated_name.max' => 'Initiated name cannot be longer than 255 characters.',

            'dob.required' => 'Date of birth is required.',
            'dob.date' => 'Please provide a valid date.',
            'dob.before' => 'Date of birth must be before today.',
            'dob.after_or_equal' => 'Date of birth must be on or after January 1, 1900.',

            'contact_number.required' => 'Contact number is required.',
            'contact_number.unique' => 'This contact number is already registered.',
            'contact_number.regex' => 'The contact number cannot start with a 0 and must be between 10 and 15 digits.',

            'have_you_applied_before.required' => 'Please specify if you have applied before.',

            'devotee_type.required' => 'Devotee registration type is required.',

            'password.required' => 'Password is required.',
            'password.string' => 'Password must be a valid string.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.confirmed' => 'Password confirmation does not match.',

            'password_confirmation.required' => 'Please confirm your password.',
            'password_confirmation.string' => 'Password confirmation must be a valid string.',
            'password_confirmation.min' => 'Password confirmation must be at least 8 characters long.',

            'relation_type.required' => 'Please select relation type.',
            'relation_type.in' => 'Invalid relation type selected.',
            'relative_login_id.required' => 'Login ID is required for relative registration.',
        ];
    }
}