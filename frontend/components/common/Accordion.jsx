// components/common/Accordion.jsx
"use client";

import { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";

// ============================================
// 📦 Context
// ============================================
const AccordionContext = createContext(null);

export function Accordion({ children, className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <AccordionContext.Provider value={{ openIndex, toggleItem }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

// ============================================
// 📦 Item
// ============================================
export function AccordionItem({ children, index }) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const { openIndex } = context;
  const isOpen = openIndex === index;

  return (
    <div className="card overflow-hidden transition-all duration-300">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, index });
        }
        return child;
      })}
    </div>
  );
}

// ============================================
// 📦 Trigger
// ============================================
export function AccordionTrigger({ children, isOpen, index }) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionTrigger must be used within an Accordion");
  }

  const { toggleItem } = context;

  return (
    <button
      onClick={() => toggleItem(index)}
      className="w-full flex justify-between items-center p-4 md:p-5 text-left hover:bg-[rgb(var(--muted))] transition-colors duration-200"
    >
      <span className="font-medium text-[rgb(var(--foreground))]">
        {children}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-[rgb(var(--muted-foreground))] transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

// ============================================
// 📦 Content
// ============================================
export function AccordionContent({ children, isOpen }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="p-4 md:p-5 pt-0 text-[rgb(var(--muted-foreground))] border-t border-[rgb(var(--border))]">
        {children}
      </div>
    </div>
  );
}
