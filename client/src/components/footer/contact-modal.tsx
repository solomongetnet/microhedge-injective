"use client";

import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Phone, Facebook, Send, Twitter } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ContactModal({ open, setIsOpen }: ContactModalProps) {
  const onOpenChange = (bool: boolean) => {
    setIsOpen(bool);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-white/10 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="overflow-hidden flex flex-col gap-6 w-full text-center max-sm:rounded-none bg-background border-border p-6"
          showCloseButton={false}
        >
          <h2 className="text-2xl underline text-primary">Contact Us</h2>

          <p className="text-lg text-muted-foreground">
            We’re here to help! Reach out to us anytime through our official channels.
          </p>

          <div className="flex flex-col gap-4 w-full">

            <Button
              variant="outline"
              className="flex items-center gap-3 justify-center py-5 text-lg"
              asChild
            >
              <a href="https://t.me/yourtelegram" target="_blank" rel="noreferrer">
                <Send className="w-5 h-5" />
                Telegram
              </a>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-3 justify-center py-5 text-lg"
              asChild
            >
              <a href="https://twitter.com/yourhandle" target="_blank" rel="noreferrer">
                <Twitter className="w-5 h-5" />
                X (Twitter)
              </a>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-3 justify-center py-5 text-lg"
              asChild
            >
              <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer">
                <Facebook className="w-5 h-5" />
                Facebook
              </a>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-3 justify-center py-5 text-lg"
            >
              <Phone className="w-5 h-5" />
              +251 911 867911
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
