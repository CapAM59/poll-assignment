export interface Answer {
    id: number;
    vote: boolean;
    timestamp: Date;
    questionId: number;
    userId: number;
}
