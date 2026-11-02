"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Button } from "../ui/Button";
import { X } from "lucide-react";

export interface ModalProps {
  title: string;
  bannerURL?: string;
  children: React.ReactNode;

  isOpen: boolean;
  onClose: () => any;
}

const Modal: React.FC<ModalProps> = ({
  title,
  bannerURL,
  children,
  isOpen,
  onClose,
}) => {
  // false during SSR/hydration, true once mounted on the client
  const domReady = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const portalRoot =
    typeof document !== "undefined" &&
    document.getElementById("__modal-wrapper");

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (isOpen) {
        document.body.style.overflow = "auto";
        return;
      }
    };
  }, [isOpen]);

  if (!portalRoot || !domReady) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed flex flex-col justify-end w-screen min-h-screen lg:pt-8 h-full z-50 overflow-x-hidden overflow-y-auto">
          <div
            className="bg-[rgba(0,0,0,0.5)] fixed w-full h-full"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              duration: 0.2,
              type: "tween",
            }}
            className=" bg-accent min-w-2xl max-w-208 w-full h-full mx-auto place-self-end rounded-t-xl"
          >
            {bannerURL ? (
              <div
                className="rounded-t-xl overflow-hidden bg-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom,transparent 0%,hsl(var(--accent)) 95%, hsl(var(--muted)) 100%), url(${bannerURL})`,
                  backgroundSize: "cover",
                }}
              >
                <div className="px-4 lg:px-8 py-4 flex justify-end items-center w-full">
                  <Button
                    size="icon"
                    className="self-end rounded-full hover:bg-primary/70 transition-all duration-300"
                    onClick={onClose}
                  >
                    <X size={18} />
                  </Button>
                </div>
                <div>
                  <div className="pt-64 px-8 pb-8">
                    <h2 className="font-bold text-xl">{title}</h2>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-8 py-4 flex justify-between items-center">
                <h2 className="font-bold text-xl">{title}</h2>
                <Button
                  size="icon"
                  className="rounded-full bg-transparent text-primary hover:bg-primary/20 transition-all duration-300"
                  onClick={onClose}
                >
                  <X size={18} />
                </Button>
              </div>
            )}

            <div className="bg-accent px-8 pb-12">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalRoot as HTMLElement
  );
};

export default Modal;
