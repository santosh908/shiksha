

export default function ContactUsComponent()
{
    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <div className="bg-gradient-to-br from-blue-50  rounded-2xl shadow-sm p-6 md:p-8 border border-blue-200">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 text-center">Contact Us</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12v1m0 4v1m-8-6v1m0 4v1m8-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m0 0h8m-8 0v2a2 2 0 002 2h4a2 2 0 002-2V7m-8 0h8" /></svg>
                        </span>
                        <span className="text-lg font-medium text-gray-800">Email:</span>
                        <a href="mailto:shiksha@iskcondwarka.in" className="text-blue-600 hover:underline">shiksha@iskcondwarka.in</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-block bg-green-100 text-green-700 rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </span>
                        <span className="text-lg font-medium text-gray-800">Call:</span>
                        <a href="tel:+919910334671" className="text-green-600 hover:underline">+91 9910334671</a>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="inline-block bg-yellow-100 text-yellow-700 rounded-full p-2 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a2 2 0 00-2-2h-3m-4 0H7a2 2 0 00-2 2v2h5m0-2v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0v-2a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
                        </span>
                        <div>
                            <span className="text-lg font-medium text-gray-800">Address:</span>
                            <div className="text-gray-700 mt-1">
                                ISKCON DWARKA<br />
                                Plot No.-4, Sub-City Level, Dwarka Sector -13,<br />
                                Behind Radisson Blu Hotel<br />
                                Delhi - 110075
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-500">
                    For any query, feel free to reach out to us via email or phone. We are happy to assist you!
                </div>
            </div>
        </div>
    );
}