function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-full space-y-8">
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="p-6 bg-slate-700">
            <h2 className="text-3xl font-extrabold text-center text-white">Oops! Something went wrong</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Error Details:</h3>
              <p className="p-3 overflow-auto text-xl text-blue-600 bg-gray-100 rounded-md">{error.message}</p>
            </div>
            <div className="mb-4">
              <h4 className="mb-2 text-lg font-semibold text-gray-900">Stack Trace:</h4>
              <pre className="p-3 overflow-auto text-red-600 bg-gray-100 rounded-md text-md">{error.stack}</pre>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 font-bold text-white transition duration-150 ease-in-out bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline">
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
