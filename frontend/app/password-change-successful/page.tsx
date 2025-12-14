import Link from "next/link";

export default function Page() {
    return (
        <section className="bg-[#0077A2] flex items-center justify-center min-h-screen">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full h-full flex items-center justify-center overflow-auto">
                <div className="bg-white rounded-lg p-6 shadow w-full lg:w-[30%] text-center">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4-4m6 2a10 10 0 11-20 0 10 10 0 0120 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-green-600">Password Changed Successfully</h1>
                    <p className="mt-2 text-gray-600 text-sm">You can now log in with your new password.</p>
                    <Link href="/user/login/" className="inline-block mt-6 w-full text-base md:text-lg font-medium py-2.5 md:py-3.5 px-10 md:px-16 rounded bg-[#ED1B24] text-white"> Back to Login </Link>
                </div>
            </div>
        </section>
    );
}
