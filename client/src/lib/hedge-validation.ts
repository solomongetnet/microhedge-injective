import { CreateHedgeInput } from "./hedge-service";

const COMMODITIES = ["COFFEE", "MAIZE", "WHEAT", "BARLEY", "SOYBEAN", "SUGAR", "COTTON", "COCOA"];

const COMMODITY_PRICES: Record<string, number> = {
  COFFEE: 245.75,
  MAIZE: 487.25,
  WHEAT: 612.50,
  BARLEY: 334.80,
  SOYBEAN: 1156.25,
  SUGAR: 23.45,
  COTTON: 78.90,
  COCOA: 3845.50,
};

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateHedge(input: CreateHedgeInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate commodity
  if (!COMMODITIES.includes(input.commodity)) {
    errors.push({
      field: "commodity",
      message: `Invalid commodity. Must be one of: ${COMMODITIES.join(", ")}`,
    });
  }

  // Validate strategy
  const validStrategies = ["put", "call", "collar", "spread"];
  if (!validStrategies.includes(input.strategy)) {
    errors.push({
      field: "strategy",
      message: `Invalid strategy. Must be one of: ${validStrategies.join(", ")}`,
    });
  }

  // Validate quantity
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
    errors.push({
      field: "quantity",
      message: "Quantity must be a positive integer",
    });
  }

  if (input.quantity > 10000) {
    errors.push({
      field: "quantity",
      message: "Quantity cannot exceed 10,000 contracts",
    });
  }

  // Validate strike price
  const currentPrice = COMMODITY_PRICES[input.commodity] || 100;
  const minStrike = currentPrice * 0.8;
  const maxStrike = currentPrice * 1.2;

  if (input.strikePrice <= 0) {
    errors.push({
      field: "strikePrice",
      message: "Strike price must be greater than 0",
    });
  }

  if (input.strikePrice < minStrike || input.strikePrice > maxStrike) {
    errors.push({
      field: "strikePrice",
      message: `Strike price should be within 20% of current price ($${minStrike.toFixed(
        2
      )} - $${maxStrike.toFixed(2)})`,
    });
  }

  // Validate expiration date
  const expirationDate = new Date(input.expirationDate);
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (isNaN(expirationDate.getTime())) {
    errors.push({
      field: "expirationDate",
      message: "Invalid expiration date format",
    });
  } else if (expirationDate <= now) {
    errors.push({
      field: "expirationDate",
      message: "Expiration date must be in the future",
    });
  } else if (expirationDate < sevenDaysFromNow) {
    errors.push({
      field: "expirationDate",
      message: "Expiration date must be at least 7 days in the future",
    });
  }

  // Validate protection level
  if (input.protectionLevel < 1 || input.protectionLevel > 100) {
    errors.push({
      field: "protectionLevel",
      message: "Protection level must be between 1 and 100%",
    });
  }

  return errors;
}

export function getValidationErrorMessage(field: string, errors: ValidationError[]): string | null {
  const error = errors.find((e) => e.field === field);
  return error ? error.message : null;
}

export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}
