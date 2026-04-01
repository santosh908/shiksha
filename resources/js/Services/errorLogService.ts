import { ErrorInfo } from 'react';

interface ErrorLogService {
    logError(error: Error, errorInfo: ErrorInfo): void;
}

class ErrorLogServiceImpl implements ErrorLogService {
    private static instance: ErrorLogServiceImpl;

    private constructor() { }

    public static getInstance(): ErrorLogServiceImpl {
        if (!ErrorLogServiceImpl.instance) {
            ErrorLogServiceImpl.instance = new ErrorLogServiceImpl();
        }
        return ErrorLogServiceImpl.instance;
    }

    public logError(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error:', error);
        console.error('Component Stack:', errorInfo.componentStack);

        // TODO: Implement additional error logging logic here
        // For example, sending error data to a logging service
    }
}

export const errorLogService = ErrorLogServiceImpl.getInstance();