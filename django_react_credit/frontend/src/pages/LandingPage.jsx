import React from "react"
import { Link } from "react-router-dom"
import { GraduationCap, BookOpen, Users, CheckCircle, ArrowRight } from "lucide-react"
//import BackgroundLayout from "../components/BackgroundLayout"

function LandingPage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    CRED<span className="text-blue-600">-IT</span>
                  </h1>
                  <p className="text-sm text-gray-500">Credit Evaluation System</p>
                </div>
              </div>
              <Link
                to="/LoginPage"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4 mr-2" />
                Educational Technology Solution
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CRED-IT
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A comprehensive software solution designed to streamline the administrative burden on department staff,
                enhance decision-making accuracy, and provide transferee students with faster and clearer results.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplified Process</h3>
                <p className="text-gray-600 text-sm">
                  Standardizes course comparison and credit accreditation between institutions
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Efficiency</h3>
                <p className="text-gray-600 text-sm">
                  Improves efficiency, transparency, and academic advising processes
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Decisions</h3>
                <p className="text-gray-600 text-sm">
                  Faster, smarter decisions for both students and educational institutions
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-12">
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                Our system revolutionizes the traditional approach to credit evaluation by eliminating manual processes
                and introducing automated, intelligent assessment tools. Say goodbye to time-consuming manual
                evaluations and embrace a future of streamlined academic transitions that benefit students, faculty, and
                institutions alike.
              </p>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                [Unsay ma add dinhi....]
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/LoginPage"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 min-w-[140px] justify-center"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-blue-200 font-medium">or</span>
                <Link
                  to="/RegisterPage"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 min-w-[140px] text-center"
                >
                  Register
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-4">to begin using the software</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">CRED-IT</h3>
                  <p className="text-sm text-gray-500">Streamlining Education</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">© 2024 CRED-IT. Empowering educational institutions worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
  )
}

export default LandingPage