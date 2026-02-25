export interface CaseType {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  lawyer?: {
    id: string;
    user: {
      name: string;
    };
  };
}