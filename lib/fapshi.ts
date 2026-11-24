/**
 * Module d'intégration Fapshi Payment Gateway
 * Supporte : MTN Mobile Money, Orange Money, Cartes Bancaires (Cameroun & Afrique Centrale)
 * Documentation : https://fapshi.com
 */

export interface FapshiInitiateRequest {
  amount: number;
  email?: string;
  externalId: string;
  redirectUrl?: string;
  userId?: string;
  message?: string;
}

export interface FapshiInitiateResponse {
  message: string;
  link: string;
  transId: string;
  dateInitiated?: string;
  isSimulation?: boolean;
}

export interface FapshiStatusResponse {
  transId: string;
  status: "CREATED" | "PENDING" | "SUCCESSFUL" | "FAILED" | "EXPIRED";
  medium?: string;
  amount?: number;
  revenue?: number;
  payerName?: string;
  email?: string;
  externalId?: string;
  userId?: string;
  financialTransId?: string;
  dateInitiated?: string;
  dateConfirmed?: string;
}

const FAPSHI_API_USER = process.env.FAPSHI_API_USER || "";
const FAPSHI_API_KEY = process.env.FAPSHI_API_KEY || "";
const FAPSHI_ENV = process.env.FAPSHI_ENV || "sandbox";

const BASE_URL =
  FAPSHI_ENV === "live"
    ? "https://live.fapshi.com"
    : "https://sandbox.fapshi.com";

export async function initiateFapshiPayment(
  data: FapshiInitiateRequest
): Promise<FapshiInitiateResponse> {
  // Mode simulation si les clés ne sont pas encore renseignées dans .env
  if (!FAPSHI_API_USER || !FAPSHI_API_KEY) {
    console.warn(
      "⚠️ FAPSHI_API_USER ou FAPSHI_API_KEY manquant. Activation du mode simulation Fapshi."
    );
    const mockTransId = `MOCK-FAP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const redirectTarget = data.redirectUrl || "/checkout/success";
    const separator = redirectTarget.includes("?") ? "&" : "?";
    
    return {
      message: "Simulation de paiement Fapshi (Mode Démo JQ BAGS)",
      link: `${redirectTarget}${separator}transId=${mockTransId}&orderId=${data.externalId}&status=SUCCESSFUL&simulated=true`,
      transId: mockTransId,
      dateInitiated: new Date().toISOString(),
      isSimulation: true,
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/initiate-pay`, {
      method: "POST",
      headers: {
        apiuser: FAPSHI_API_USER,
        apikey: FAPSHI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(data.amount),
        email: data.email,
        externalId: data.externalId,
        redirectUrl: data.redirectUrl,
        userId: data.userId,
        message: data.message || `Commande ${data.externalId} - JQ BAGS`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Fapshi:", response.status, errorText);
      throw new Error(`Erreur Fapshi (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result as FapshiInitiateResponse;
  } catch (err: any) {
    console.error("Échec de connexion Fapshi:", err);
    throw err;
  }
}

export async function checkFapshiStatus(
  transId: string
): Promise<FapshiStatusResponse> {
  // Cas simulé
  if (transId.startsWith("MOCK-FAP-") || !FAPSHI_API_USER) {
    return {
      transId,
      status: "SUCCESSFUL",
      medium: "Mobile Money (Simulé)",
      dateConfirmed: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/payment-status/${transId}`, {
      method: "GET",
      headers: {
        apiuser: FAPSHI_API_USER,
        apikey: FAPSHI_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur statut Fapshi (${response.status})`);
    }

    const result = await response.json();
    return result as FapshiStatusResponse;
  } catch (err: any) {
    console.error("Erreur vérification Fapshi:", err);
    return {
      transId,
      status: "FAILED",
    };
  }
}

