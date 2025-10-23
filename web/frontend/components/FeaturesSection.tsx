import { Shield, Zap, FileText, Languages, Lock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Bypass AI Detection",
    description: "Make your AI-generated content undetectable by AI detection tools while maintaining quality and meaning.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get humanized results in seconds. Our advanced AI processes your text instantly with high accuracy.",
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Support for text input and document uploads (PDF, DOCX, PPTX, TXT) up to 40MB.",
  },
  {
    icon: Languages,
    title: "Natural Language",
    description: "Transform robotic AI text into natural, conversational content that sounds genuinely human-written.",
  },
  {
    icon: Lock,
    title: "100% Free",
    description: "No hidden fees, no credit card required. Unlimited usage for everyone, completely free forever.",
  },
  {
    icon: Sparkles,
    title: "Customizable Styles",
    description: "Choose from multiple writing styles: Academic, Business, Creative, Friendly, and more.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Our AI Humanizer?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            The most advanced AI text humanizer with powerful features to make your content authentic and undetectable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

