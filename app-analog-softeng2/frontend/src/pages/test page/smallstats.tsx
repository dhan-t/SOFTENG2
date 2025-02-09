import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

interface DataItem {
  name: string;
  produced: number;
  requirement: number;
}

interface StatsCardProps {
  title: string;
  data: DataItem[];
}

const StatsCard: React.FC<StatsCardProps> = ({ title, data }) => {
  return (
    <Card sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {data.map((item, index) => {
            const difference = item.produced - item.requirement;
            const isPositive = difference >= 0;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: isPositive ? "#e8f5e9" : "#ffebee",
                    padding: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography
                      variant="h5"
                      color={isPositive ? "green" : "red"}
                    >
                      {item.produced}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Requirement: {item.requirement}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={isPositive ? "green" : "red"}
                    >
                      {isPositive ? "Above" : "Below"} Requirement by{" "}
                      {Math.abs(difference)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

const SmallStats: React.FC = () => {
  const data = {
    daily: [
      { name: "Day 1", produced: 65, requirement: 70 },
      { name: "Day 2", produced: 75, requirement: 70 },
      { name: "Day 3", produced: 80, requirement: 70 },
      { name: "Day 4", produced: 85, requirement: 70 },
      { name: "Day 5", produced: 90, requirement: 70 },
      { name: "Day 6", produced: 100, requirement: 70 },
      { name: "Day 7", produced: 110, requirement: 70 },
    ],
    weekly: [
      { name: "Week 1", produced: 450, requirement: 420 },
      { name: "Week 2", produced: 470, requirement: 420 },
      { name: "Week 3", produced: 500, requirement: 420 },
      { name: "Week 4", produced: 550, requirement: 420 },
    ],
    monthly: [
      { name: "Jan", produced: 1700, requirement: 1600 },
      { name: "Feb", produced: 1800, requirement: 1600 },
      { name: "Mar", produced: 1900, requirement: 1650 },
      { name: "Apr", produced: 1950, requirement: 1650 },
      { name: "May", produced: 2000, requirement: 1700 },
      { name: "Jun", produced: 2100, requirement: 1700 },
      { name: "Jul", produced: 2150, requirement: 1750 },
      { name: "Aug", produced: 2200, requirement: 1750 },
      { name: "Sep", produced: 2250, requirement: 1800 },
      { name: "Oct", produced: 2300, requirement: 1800 },
      { name: "Nov", produced: 2350, requirement: 1850 },
      { name: "Dec", produced: 2400, requirement: 1850 },
    ],
  };

  return (
    <div>
      <StatsCard title="Daily Production" data={data.daily} />
      <StatsCard title="Weekly Production" data={data.weekly} />
      <StatsCard title="Monthly Production" data={data.monthly} />
    </div>
  );
};

export default SmallStats;
