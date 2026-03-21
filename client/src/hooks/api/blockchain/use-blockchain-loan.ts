"use client";

import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseUnits } from "viem";
import { useState } from "react";
import { toast } from "sonner";
import { LOAN_POOL_ADDRESS, CCTC_ADDRESS, loanPoolAbi, coinAbi } from "@/lib/contracts";

// ─────────────────────────────────────────────────────────────────────────────
// Read: available pool balance from smart contract
// ─────────────────────────────────────────────────────────────────────────────
export const useAvailablePoolBalance = () => {
  return useReadContract({
    address: LOAN_POOL_ADDRESS,
    abi: loanPoolAbi,
    functionName: "getAvailablePool",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Read: user's loan IDs from smart contract
// ─────────────────────────────────────────────────────────────────────────────
export const useUserLoansOnChain = () => {
  const { address } = useAccount();
  return useReadContract({
    address: LOAN_POOL_ADDRESS,
    abi: loanPoolAbi,
    functionName: "getUserLoans",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Read: a single on-chain loan by id
// ─────────────────────────────────────────────────────────────────────────────
export const useOnChainLoan = (loanId: bigint | undefined) => {
  return useReadContract({
    address: LOAN_POOL_ADDRESS,
    abi: loanPoolAbi,
    functionName: "loans",
    args: loanId !== undefined ? [loanId] : undefined,
    query: { enabled: loanId !== undefined },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Read: user's on-chain credit limit
// ─────────────────────────────────────────────────────────────────────────────
export const useUserCreditLimit = () => {
  const { address } = useAccount();
  return useReadContract({
    address: LOAN_POOL_ADDRESS,
    abi: loanPoolAbi,
    functionName: "userCreditLimits",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Write: requestLoan(amount) → sends cCTC tokens to user wallet
// Returns { requestLoan, isPending, isConfirming, isConfirmed, txHash }
// ─────────────────────────────────────────────────────────────────────────────
export const useRequestLoanOnChain = () => {
  const { writeContractAsync, isPending, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const requestLoan = async (amountCTC: number): Promise<string | null> => {
    try {
      const amountWei = parseUnits(amountCTC.toString(), 18);
      const hash = await writeContractAsync({
        address: LOAN_POOL_ADDRESS,
        abi: loanPoolAbi,
        functionName: "requestLoan",
        args: [amountWei],
      });
      return hash;
    } catch (err: any) {
      const msg = err?.shortMessage || err?.message || "Transaction rejected";
      toast.error(`Loan request failed: ${msg}`);
      return null;
    }
  };

  return { requestLoan, isPending, isConfirming, isConfirmed, txHash };
};

// ─────────────────────────────────────────────────────────────────────────────
// Write: approve cCTC then repayLoan(loanId) on LoanPool
// Returns { repayLoan, isPending }
// ─────────────────────────────────────────────────────────────────────────────
export const useRepayLoanOnChain = () => {
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const repayLoan = async (loanId: bigint, amountCTC: number): Promise<string | null> => {
    setIsPending(true);
    try {
      const amountWei = parseUnits(amountCTC.toString(), 18);

      // Step 1: Approve the LoanPool to spend cCTC tokens
      const approveHash = await writeContractAsync({
        address: CCTC_ADDRESS,
        abi: coinAbi,
        functionName: "approve",
        args: [LOAN_POOL_ADDRESS, amountWei],
      });
      toast("Approval submitted, waiting for confirmation...");

      // Step 2: Call repayLoan on the LoanPool
      const repayHash = await writeContractAsync({
        address: LOAN_POOL_ADDRESS,
        abi: loanPoolAbi,
        functionName: "repayLoan",
        args: [loanId],
      });

      return repayHash;
    } catch (err: any) {
      const msg = err?.shortMessage || err?.message || "Transaction rejected";
      toast.error(`Repayment failed: ${msg}`);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  return { repayLoan, isPending };
};
