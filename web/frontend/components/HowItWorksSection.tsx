import { Upload, Settings, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "1. Input Your Text",
    description: "Paste your AI-generated text or upload a document (PDF, DOCX, PPTX, TXT).",
  },
  {
    icon: Settings,
    title: "2. Choose Settings",
    description: "Select length, similarity level, and writing style to match your needs.",
  },
  {
    icon: Sparkles,
    title: "3. Click Humanize",
    description: "Our advanced AI instantly transforms your text into natural, human-like content.",
  },
  {
    icon: Download,
    title: "4. Copy & Use",
    description: "Download or copy your humanized text and use it anywhere with confidence.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform your AI-generated content in 4 simple steps. Fast, easy, and completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 -z-10" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

