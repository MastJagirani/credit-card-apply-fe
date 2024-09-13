import Image from "next/image";
import Stepper from "@/components/Stepper"

export default async function Home() {
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-8 sm:p-20 bg-gray-50">
  <header className="text-center">
    <h1 className="text-3xl font-semibold text-gray-800">Credit Card Application</h1>
    <p className="text-gray-600 mt-2">Please fill in the application</p>
  </header>

  <main className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
    <Stepper />
  </main>

  <footer className="text-sm text-gray-500">
    &copy; {new Date().getFullYear()} Company Name. All rights reserved.
  </footer>
</div>
  );
}
