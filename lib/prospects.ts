export interface Prospect {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  location: string;
  opportunity: string;
  status: string;
}

/** Converts provider-specific enrichment responses into the UI's neutral lead shape. */
export function normalizeProspects(records: unknown[]): Prospect[] {
  return records.map((record, index) => {
    const lead = record as Record<string, unknown>;
    return {
      id: String(lead.id ?? lead.email ?? index),
      companyName: String(lead.companyName ?? lead.company ?? lead.name ?? 'Unnamed organization'),
      contactName: String(lead.contactName ?? lead.owner ?? lead.contact ?? 'Unknown contact'),
      contactEmail: String(lead.contactEmail ?? lead.email ?? ''),
      location: String(lead.location ?? lead.region ?? 'Not provided'),
      opportunity: String(lead.opportunity ?? lead.wasteProblem ?? lead.painPoint ?? 'Not provided'),
      status: String(lead.status ?? 'Unverified'),
    };
  });
}
