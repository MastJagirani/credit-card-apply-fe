import { IdentityVerification } from '../types/IdentityVerification'; 

const baseUrl = 'http://localhost:8080/api/v1/credit-card';

export async function postIdentityVerification(data: { fullName: string; emiratesId: string }): Promise<IdentityVerification> {
  const response = await fetch(baseUrl+'/identity-verification', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data),
    cache: 'no-store' 
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch data: ${response.status} ${errorText}`);
  }

  const result: IdentityVerification = await response.json();
  return result;
}

 interface CompleteVerificationRequest {
    nationality: string;
    mobile: string;
    address: string;
    company: string;
    joinDate: string;
    employmentType: string;
    annualIncome: number;
    requestedCreditLimit: number;
  }
  
  interface CompleteVerificationResponse {
     employmentCheck: boolean;
    complianceCheck: boolean;
    riskEvaluation: number;
    behavioralAnalysis: number;
    score: number;
    outcome: string;
  }
  

   export async function postCompleteVerification(
    uuid: string,
    data: { nationality: string;
        mobile: string;
        address: string;
        company: string;
        joinDate: string;
        employmentType: string;
        annualIncome: number;
        requestedCreditLimit: number; }
  ): Promise<CompleteVerificationResponse> {
    const response = await fetch(baseUrl+`/complete-verification/${uuid}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data),
      cache: 'no-store'  
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch data: ${response.status} ${errorText}`);
    }
  
    const result: CompleteVerificationResponse = await response.json();
    return result;
  }
  