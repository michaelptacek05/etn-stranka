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
    { hour: "8:00", value: 15, level: "low" },
    { hour: "9:00", value: 22, level: "low" },
    { hour: "10:00", value: 38, level: "low" },
    { hour: "11:00", value: 55, level: "medium" },
    { hour: "12:00", value: 78, level: "high" },
    { hour: "13:00", value: 85, level: "high" },
    { hour: "14:00", value: 62, level: "medium" },
    { hour: "15:00", value: 45, level: "medium" },
    { hour: "16:00", value: 58, level: "medium" },
    { hour: "17:00", value: 72, level: "high" },
    { hour: "18:00", value: 50, level: "medium" },
    { hour: "19:00", value: 33, level: "low" },
    { hour: "20:00", value: 20, level: "low" },
    { hour: "21:00", value: 12, level: "low" },
    { hour: "22:00", value: 8, level: "low" },
];