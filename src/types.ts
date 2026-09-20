export type Attraction = {
  id: string;
  name: string;
  entityType: string;
  status?: string;
  queue?: {
    STANDBY?: {
      waitTime?: number | null;
    };
  };
};