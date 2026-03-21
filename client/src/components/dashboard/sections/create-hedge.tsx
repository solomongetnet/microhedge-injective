"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Shield, Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createHedge } from "@/lib/hedge-service";
import { validateCreateHedge } from "@/lib/hedge-validation";
import { COMMODITIES, HEDGE_STRATEGIES } from "@/lib/commodities";

export function CreateHedgeSection() {
  const [strategy, setStrategy] = useState("put");
  const [asset, setAsset] = useState("COFFEE");
  const [shares, setShares] = useState("");
  const [quantity, setQuantity] = useState("");
  const [strikePrice, setStrikePrice] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const selectedCommodity = COMMODITIES.find(c => c.symbol === asset) || COMMODITIES[0];

  const handleCreateHedge = async () => {
    setErrors({});
    const qty = shares ? parseInt(shares) : 0;
    const strike = strikePrice ? parseFloat(strikePrice) : 0;
    const protection = quantity ? parseInt(quantity) : 50;

    const validationErrors = validateCreateHedge({
      commodity: asset,
      strategy,
      quantity: qty,
      strikePrice: strike,
      expirationDate: expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      protectionLevel: protection,
    });

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setLoading(true);
    try {
      await createHedge({
        commodity: asset,
        strategy,
        quantity: qty,
        strikePrice: strike,
        expirationDate: expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        protectionLevel: protection,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShares("");
        setQuantity("");
        setStrikePrice("");
        setExpirationDate("");
      }, 2000);
    } catch (error) {
      console.error("Failed to create hedge:", error);
      setErrors({ submit: "Failed to create hedge. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Hedge</h1>
        <p className="text-muted-foreground mt-1">Protect your portfolio with a custom hedging strategy</p>
      </div>

      <Alert className="border-accent/50 bg-accent/5">
        <Shield className="h-4 w-4 text-accent" />
        <AlertDescription>
          Hedging allows you to protect your portfolio from downside risk. You can use options, futures, or spread strategies.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>New Hedge Position</CardTitle>
              <CardDescription>Configure your hedging strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-foreground">Hedge created successfully!</p>
                    <p className="text-sm text-muted-foreground">View it in My Hedges section</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              {/* Strategy Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Hedge Strategy</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {HEDGE_STRATEGIES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setStrategy(s.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        strategy === s.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <div className="font-medium text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asset Selection */}
              <div className="space-y-2">
                <Label htmlFor="asset">Commodity</Label>
                <select
                  id="asset"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                >
                  {COMMODITIES.map((c) => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.symbol} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Strike Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shares">Number of Contracts</Label>
                  <Input
                    id="shares"
                    type="number"
                    placeholder="e.g., 500"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className={`bg-input border-border ${errors.quantity ? "border-destructive" : ""}`}
                  />
                  {errors.quantity && (
                    <p className="text-xs text-destructive">{errors.quantity}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Total exposure: ${shares && parseFloat(shares) > 0 ? (parseFloat(shares) * selectedCommodity.price).toLocaleString('en-US', {maximumFractionDigits: 2}) : '0'}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strikePrice">Strike Price</Label>
                  <Input
                    id="strikePrice"
                    type="number"
                    step="0.01"
                    placeholder={`e.g., ${selectedCommodity.price.toFixed(2)}`}
                    value={strikePrice}
                    onChange={(e) => setStrikePrice(e.target.value)}
                    className={`bg-input border-border ${errors.strikePrice ? "border-destructive" : ""}`}
                  />
                  {errors.strikePrice && (
                    <p className="text-xs text-destructive">{errors.strikePrice}</p>
                  )}
                </div>
              </div>

              {/* Expiration Date & Protection Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration Date</Label>
                  <Input
                    id="expiration"
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className={`bg-input border-border ${errors.expirationDate ? "border-destructive" : ""}`}
                  />
                  {errors.expirationDate && (
                    <p className="text-xs text-destructive">{errors.expirationDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protection">Protection Level (%)</Label>
                  <div className="flex gap-2">
                    {[70, 80, 90, 95].map((level) => (
                      <Button
                        key={level}
                        variant="outline"
                        type="button"
                        className={`flex-1 text-xs ${
                          quantity === level.toString()
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary border-border hover:bg-secondary/80"
                        }`}
                        onClick={() => setQuantity(level.toString())}
                      >
                        {level}%
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimated Cost */}
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Estimated Premium</span>
                  <span className="text-sm text-muted-foreground">Per Contract</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {shares && quantity ? `$${(parseFloat(shares) * selectedCommodity.price * (parseInt(quantity) / 100) * 0.025).toLocaleString('en-US', {maximumFractionDigits: 2})}` : '$0'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {shares && quantity ? `$${((selectedCommodity.price * 0.025).toFixed(2))}` : 'Calculate'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={handleCreateHedge}
                  disabled={loading || success}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {success ? "Created!" : "Create Hedge"}
                </Button>
                <Button variant="outline" className="flex-1" disabled={loading || success}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Strategy Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">About This Strategy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              {strategy === "put" && (
                <>
                  <p>Put options give you the right to sell at a strike price, protecting against downside.</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Full downside protection</li>
                    <li>Unlimited upside</li>
                    <li>Premium cost deducted</li>
                  </ul>
                </>
              )}
              {strategy === "call-spread" && (
                <>
                  <p>A call spread reduces cost by selling upside, limiting gains but reducing premium.</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Partial protection</li>
                    <li>Limited gains</li>
                    <li>Lower cost</li>
                  </ul>
                </>
              )}
              {strategy === "collar" && (
                <>
                  <p>A collar combines puts and calls for balanced protection with minimal cost.</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Floor and ceiling</li>
                    <li>Near zero cost</li>
                    <li>Balanced approach</li>
                  </ul>
                </>
              )}
              {strategy === "future" && (
                <>
                  <p>Short futures provide direct hedging with leverage, effective for large positions.</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Direct hedging</li>
                    <li>Leverage available</li>
                    <li>Requires margin</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {/* Risk Notice */}
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-xs text-destructive/80">
              Hedging involves risks. Consult a financial advisor before creating complex strategies.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
