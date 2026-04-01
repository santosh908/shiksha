<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}"> <!-- Link to your main CSS file -->
    <style>
        /* Translated CSS styles */
        .root {
            padding-top: 80px;
            padding-bottom: 80px;
            text-align: center;
        }

        .label {
            text-align: center;
            font-weight: 900;
            font-size: 38px;
            line-height: 1;
            margin-bottom: calc(1.5 * var(--mantine-spacing-xl, 16px));
            color: #adb5bd; /* Equivalent to mantine-color-gray-2 */
        }

        @media (max-width: 640px) { /* Using a general mobile breakpoint */
            .label {
                font-size: 32px;
            }
            .title {
                font-size: 32px;
            }
        }

        .description {
            max-width: 500px;
            margin: 1rem auto 1.5rem auto;
            color: #6c757d; /* dimmed color */
            font-size: 1.125rem;
        }

        .title {
            font-family: 'Greycliff CF', sans-serif;
            text-align: center;
            font-weight: 900;
            font-size: 38px;
            color: #343a40; /* Adjust to match title styling */
        }

        .button {
            display: inline-block;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            color: #007bff;
            background-color: transparent;
            border: 1px solid transparent;
            cursor: pointer;
            text-decoration: none;
        }

        .button:hover {
            color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container root">
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
        <a href="/login"> Click here to log in</a> <!-- Link to login page or home -->
    </div>
</body>
</html>
