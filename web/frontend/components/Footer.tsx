import Link from "next/link";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Humanizer
                </span>
                <span className="text-xs text-slate-500">100% Free Tool</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Transform AI-generated text into natural, human-like content. Free, fast, and effective.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@aihumanizer.com"
                className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  AI Humanizer
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#how-it-works" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} AI Humanizer. All rights reserved.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Made with ❤️ for better content creation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

