"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModalStore, useCustomToastStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";

interface IProps {
  position?: "top" | "bottom";
  className?: string;
}

export function CustomToastContainer({ position = "top", className }: IProps) {
  const { isCustomToastVisible, code, hideCustomToast, customMessage } = useCustomToastStore();

  const { setUpgradeModalOpen } = useModalStore();

  const handleClose = () => hideCustomToast();
  const handleNewChat = () => (window.location.href = "/");
  const handleGetPlus = () => {
    setUpgradeModalOpen(true);
    hideCustomToast();
  };

  const toast: any = code ? code : null;

  return (
    <AnimatePresence>
      {isCustomToastVisible && toast && (
        <motion.div
          key={code}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "fixed left-1/2 transform -translate-x-1/2 z-50 w-full px-2 sm:px-4",
            "max-w-sm sm:max-w-2xl md:max-w-4xl",
            position === "top" ? "top-2 sm:top-4" : "bottom-2 sm:bottom-4",
            className
          )}
        >
          <div className="bg-gray-800 text-white rounded-lg p-3 sm:p-4 shadow-lg border border-gray-700">
            {/* Mobile Layout */}
            <div className="flex flex-col gap-3 sm:hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-tight">
                    {toast.message}
                  </h3>
                </div>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                {toast.description}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleNewChat}
                  className="bg-white text-black hover:bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium flex-1"
                >
                  New chat
                </Button>
                <Button
                  onClick={handleGetPlus}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700 px-3 py-1.5 rounded-full text-xs font-medium bg-transparent flex-1"
                >
                  Get Plus
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{toast.message}</h3>
                <p className="text-gray-300 text-sm">{toast.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  onClick={handleNewChat}
                  className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-medium"
                >
                  New chat
                </Button>
                <Button
                  onClick={handleGetPlus}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium bg-transparent"
                >
                  Get Plus
                </Button>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
