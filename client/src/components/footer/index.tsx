"use client";

import React, { useState } from "react";
import AboutModal from "./about-modal";
import FaqModal from "./faq-modal";
import ContactModal from "./contact-modal";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Footer = ({ className }: { className?: string }) => {
  const [aboutModal, setAboutModal] = useState(false);
  const [faqModal, setFaqModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const pathname = usePathname();

  if (pathname.includes("chat") || pathname.includes("marketplace")) {
    return null;
  }
  return (
    <>
      <div
        className={cn(
          `pt-6 pb-10 w-full flex justify-center items-center ${className}`
        )}
      >
        <div className="flex gap-4 md:gap-8 items-center ">
          <span
            className="text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => {
              setAboutModal(true);
            }}
          >
            About
          </span>
          <span
            className="text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => {
              setFaqModal(true);
            }}
          >
            {" "}
            Faq
          </span>

          <span
            className="text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => {
              setContactModal(true);
            }}
          >
            {" "}
            Contact us
          </span>
        </div>
      </div>

      {/* modals */}
      <AboutModal open={aboutModal} setIsOpen={setAboutModal} />
      <FaqModal open={faqModal} setIsOpen={setFaqModal} />
      <ContactModal open={contactModal} setIsOpen={setContactModal} />
    </>
  );
};

export default Footer;
