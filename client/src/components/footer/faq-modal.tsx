"use client";

import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FaqModalProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FaqModal({ open, setIsOpen }: FaqModalProps) {
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
          className="overflow-hidden flex flex-col gap-4 w-full text-center max-sm:rounded-none bg-background border-border p-6"
          showCloseButton={false}
        >
          <h2 className="text-2xl underline text-primary">FAQ</h2>

          <Accordion type="single" collapsible className="w-full text-left">

            <AccordionItem value="item-1">
              <AccordionTrigger>What is Charapia?</AccordionTrigger>
              <AccordionContent>
                Charapia is an AI-powered platform that lets users create
                unique digital characters and convert them into NFTs on the
                Polkadot ecosystem.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I mint my character as an NFT?</AccordionTrigger>
              <AccordionContent>
                After creating your character, you can click “Convert to NFT.”
                Your wallet will open, and once you confirm the transaction,
                your character becomes a verified NFT on Moonbeam/Moonbase.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Which blockchain does Charapia use?</AccordionTrigger>
              <AccordionContent>
                Charapia uses the Polkadot ecosystem — mainly Moonbeam and
                Moonbase Alpha for testing — chosen for speed, low fees, and
                scalability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is Charapia free to use?</AccordionTrigger>
              <AccordionContent>
                Creating characters is free. NFT minting requires a small
                blockchain gas fee depending on the network (Moonbase testnet
                is free using test tokens).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Do I own my character after minting?</AccordionTrigger>
              <AccordionContent>
                Yes. Once minted, the NFT is fully owned by your wallet, stored
                on-chain, and cannot be changed or removed by anyone.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
}
