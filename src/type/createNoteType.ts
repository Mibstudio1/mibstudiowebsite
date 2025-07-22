export interface Data {
  project: string;
  title: string;
  date: string;
  attendees: { role: string; name: string }[];
  details: { name: string; description: string }[];
  summaries: { topic: string; conclude: string }[];
  pdfs: (File | { name: string; url: string; isExisting?: boolean })[];
}
