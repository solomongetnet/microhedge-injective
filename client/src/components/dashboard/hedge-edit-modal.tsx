"use client";

import { useState } from "react";
import { Hedge, updateHedge } from "@/lib/hedge-service";
import { validateCreateHedge, getValidationErrorMessage } from "@/lib/hedge-validation";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HedgeEditModalProps {
  hedge: Hedge;
  onClose: () => void;
  onSave: (updated: Hedge) => void;
}

export function HedgeEditModal({ hedge, onClose, onSave }: HedgeEditModalProps) {
  const [quantity, setQuantity] = useState(hedge.quantity.toString());
  const [strikePrice, setStrikePrice] = useState(hedge.strikePrice.toString());
  const [protectionLevel, setProtectionLevel] = useState(hedge.protectionLevel.toString());
  const [expirationDate, setExpirationDate] = useState(hedge.expirationDate);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    const errors: Record<string, string> = {};

    // Validate quantity
    const qty = parseInt(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      errors.quantity = "Quantity must be a positive integer";
    }

    // Validate strike price
    const strike = parseFloat(strikePrice);
    if (isNaN(strike) || strike <= 0) {
      errors.strikePrice = "Strike price must be greater than 0";
    }

    // Validate protection level
    const level = parseInt(protectionLevel);
    if (level < 1 || level > 100) {
      errors.protectionLevel = "Protection level must be between 1 and 100%";
    }

    // Validate expiration date
    const expDate = new Date(expirationDate);
    const now = new Date();
    if (expDate <= now) {
      errors.expirationDate = "Expiration date must be in the future";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const updated = await updateHedge(hedge.id, {
        quantity: qty,
        strikePrice: strike,
        protectionLevel: level,
        expirationDate,
      });
      onSave(updated);
      onClose();
    } catch (error) {
      console.error("Failed to update hedge:", error);
      setErrors({ submit: "Failed to update hedge" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Edit Hedge</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {errors.submit}
            </div>
          )}

          {/* Commodity & Strategy (read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Commodity</Label>
              <p className="text-sm font-medium text-foreground mt-1">{hedge.commodity}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Strategy</Label>
              <p className="text-sm font-medium text-foreground mt-1 capitalize">{hedge.strategy}</p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-xs text-muted-foreground">
              Quantity (Contracts)
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (errors.quantity) setErrors({ ...errors, quantity: "" });
              }}
              className={`mt-1 bg-input border-border ${
                errors.quantity ? "border-destructive" : ""
              }`}
            />
            {errors.quantity && (
              <p className="text-xs text-destructive mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Strike Price */}
          <div>
            <Label htmlFor="strikePrice" className="text-xs text-muted-foreground">
              Strike Price
            </Label>
            <Input
              id="strikePrice"
              type="number"
              step="0.01"
              value={strikePrice}
              onChange={(e) => {
                setStrikePrice(e.target.value);
                if (errors.strikePrice) setErrors({ ...errors, strikePrice: "" });
              }}
              className={`mt-1 bg-input border-border ${
                errors.strikePrice ? "border-destructive" : ""
              }`}
            />
            {errors.strikePrice && (
              <p className="text-xs text-destructive mt-1">{errors.strikePrice}</p>
            )}
          </div>

          {/* Protection Level */}
          <div>
            <Label htmlFor="protectionLevel" className="text-xs text-muted-foreground">
              Protection Level (%)
            </Label>
            <Input
              id="protectionLevel"
              type="number"
              min="1"
              max="100"
              value={protectionLevel}
              onChange={(e) => {
                setProtectionLevel(e.target.value);
                if (errors.protectionLevel) setErrors({ ...errors, protectionLevel: "" });
              }}
              className={`mt-1 bg-input border-border ${
                errors.protectionLevel ? "border-destructive" : ""
              }`}
            />
            {errors.protectionLevel && (
              <p className="text-xs text-destructive mt-1">{errors.protectionLevel}</p>
            )}
          </div>

          {/* Expiration Date */}
          <div>
            <Label htmlFor="expirationDate" className="text-xs text-muted-foreground">
              Expiration Date
            </Label>
            <Input
              id="expirationDate"
              type="date"
              value={expirationDate.split("T")[0]}
              onChange={(e) => {
                setExpirationDate(new Date(e.target.value).toISOString());
                if (errors.expirationDate) setErrors({ ...errors, expirationDate: "" });
              }}
              className={`mt-1 bg-input border-border ${
                errors.expirationDate ? "border-destructive" : ""
              }`}
            />
            {errors.expirationDate && (
              <p className="text-xs text-destructive mt-1">{errors.expirationDate}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-secondary/30">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
