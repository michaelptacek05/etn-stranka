export type ChartPriority = "low" | "medium" | "high";

export interface ChartValues{
    hour: string;
    value: number;
    level: ChartPriority;
}

export const chartLabels: Record<ChartPriority, string> = {
    low: "bez fronty",
    medium: "možnost fronty",
    high: "pravděpodobné čekání ve frontě",
};

export const chartData: ChartValues[] = [
    { hour: "8:00", value: 30, level: "low"},
    { hour: "9:00", value: 25, level: "low"},
    { hour: "10:00", value: 25, level: "low"},
    { hour: "11:00", value: 25, level: "low"},
    { hour: "12:00", value: 25, level: "low"},
    { hour: "13:00", value: 25, level: "low"},
    { hour: "14:00", value: 25, level: "low"},
    { hour: "15:00", value: 25, level: "low"},
    { hour: "16:00", value: 25, level: "low"},
    { hour: "17:00", value: 25, level: "low"},
    { hour: "18:00", value: 25, level: "low"},
    { hour: "19:00", value: 25, level: "low"},
    { hour: "20:00", value: 25, level: "low"},
    { hour: "21:00", value: 25, level: "low"},
    { hour: "22:00", value: 25, level: "low"},
];