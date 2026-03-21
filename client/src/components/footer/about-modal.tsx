"use client";

import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-mobile";

interface AboutModalProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AboutModal({ open, setIsOpen }: AboutModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
          className="overflow-hidden flex flex-col text-center gap-0 w-full max-sm:rounded-none bg-background border-border"
          showCloseButton={false}
        >
          <div className="max-h-[500px] overflow-y-scroll">
            <h2 className="text-2xl underline text-primary">About Us</h2>

            <div className="pt-4 text-lg space-y-4 text-left">
              <p>
                At <strong>Charapia</strong>, we are redefining the way people
                create, own, and interact with digital characters. Built at the
                intersection of
                <strong> AI, storytelling, and blockchain</strong>, Charapia
                empowers anyone to transform their imagination into living,
                evolving characters — and securely own them as NFTs on the{" "}
                <strong>Polkadot ecosystem</strong>.
              </p>

              <p>
                We believe characters are more than drawings. They are
                identities, stories, and digital companions. Our mission is to
                give creators, collectors, and communities the tools to bring
                these characters to life in a way that is{" "}
                <strong>secure, decentralized, and truly theirs</strong>.
              </p>

              <p>
                Charapia enables <strong>AI-powered character creation</strong>,
                seamless NFT conversion, and cross-platform identity for the
                next generation of digital worlds. Whether you're an artist,
                storyteller, gamer, or Web3 explorer, Charapia is designed to
                help you bring your ideas to life — and own them forever.
              </p>

              <div className="bg-primary/90">
                <p className="bg-mask">
                  Built on Polkadot for its speed, low costs, and security,
                  Charapia ensures every NFT is fast, eco-friendly, and
                  future-ready.
                </p>
              </div>

              <p>
                We are committed to building a platform that is
                <strong>
                  {" "}
                  transparent, decentralized, creator-first, and user-friendly
                </strong>
                . Charapia is where imagination meets Web3 — and where
                characters become something more.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
