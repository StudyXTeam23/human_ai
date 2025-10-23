import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is an AI Humanizer?",
    answer: "An AI Humanizer is a tool that transforms AI-generated text (like content from ChatGPT, GPT-4, or other AI models) into natural, human-like writing. It removes robotic patterns and makes the text sound more authentic and conversational.",
  },
  {
    question: "Is this tool really 100% free?",
    answer: "Yes! Our AI Humanizer is completely free with unlimited usage. There are no hidden fees, no credit card requirements, and no subscription plans. We believe everyone should have access to quality content transformation tools.",
  },
  {
    question: "Can it bypass AI detection tools?",
    answer: "Our AI Humanizer is designed to make your content sound more natural and human-like, which can help it pass AI detection tools. However, we recommend always reviewing and editing the output to ensure it meets your specific needs and guidelines.",
  },
  {
    question: "What file formats are supported?",
    answer: "We support text input directly in the editor, as well as document uploads in PDF, DOCX (Microsoft Word), PPTX (PowerPoint), and TXT formats. Maximum file size is 40MB.",
  },
  {
    question: "How long does it take to humanize text?",
    answer: "Processing is lightning fast! Most texts are humanized within 2-5 seconds, depending on length. Larger documents may take up to 30 seconds.",
  },
  {
    question: "Is my data safe and private?",
    answer: "Absolutely. We take privacy seriously. Your text and documents are processed securely and are not stored permanently on our servers. We do not share your content with third parties.",
  },
  {
    question: "What's the character limit?",
    answer: "For text mode, you can input 300-5,000 characters per request. For document mode, there's no strict limit, but very large documents (over 100 pages) may be automatically truncated to ensure processing speed.",
  },
  {
    question: "Can I use this for academic work?",
    answer: "While our tool can help improve writing quality, we strongly recommend using it ethically and in compliance with your institution's academic integrity policies. Always review, edit, and properly cite your sources.",
  },
  {
    question: "What languages are supported?",
    answer: "Currently, our AI Humanizer works best with English and Chinese text. Support for additional languages is coming soon!",
  },
  {
    question: "Can I customize the output style?",
    answer: "Yes! You can choose from multiple writing styles including Neutral, Academic, Business, Creative, Technical, Friendly, and Informal. You can also provide custom style instructions for more specific needs.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Got questions? We've got answers. Learn more about our AI Humanizer tool.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

