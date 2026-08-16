"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/common/Accordion";
import { Mail, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What is Car Marketplace?",
    answer:
      "Car Marketplace is the leading online platform for buying and selling cars. We connect thousands of buyers and sellers every day.",
  },
  {
    question: "How does it work?",
    answer:
      "Create an account, list your car, connect with buyers, and complete the sale.",
  },
  {
    question: "Is it safe?",
    answer:
      "Yes! We take security very seriously with verified user profiles, secure payment processing, and 24/7 support.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-center mb-2">
          About Car Marketplace
        </h1>
        <p className="text-[rgb(var(--muted-foreground))] text-center mb-8">
          Everything you need to know about our platform
        </p>

        {/* ===== FAQ Section ===== */}
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} index={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* ===== Contact Section ===== */}
        <div className="mt-12 p-6 bg-primary-500/5 rounded-xl border border-primary-500/20 text-center">
          <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
          <p className="text-[rgb(var(--muted-foreground))] mb-4">
            We're here to help you with anything you need.
          </p>
          <Link href="/contact">
            <button className="btn-primary flex items-center gap-2 mx-auto">
              <Mail className="w-4 h-4" />
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
