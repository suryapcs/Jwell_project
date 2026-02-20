
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import CountUp from "react-countup";
import { TrendingUp, Diamond } from "@mui/icons-material";
import api from "../../utils/api";

const LoanRepayment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get(
          "/api/jewellery/summary"
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Error fetching jewellery summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            background: "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 600,
          }}
        >
          Loading Jewellery Data...
        </Typography>
      </Box>
    );

  const cardColors = [
    {
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadow: "rgba(102, 126, 234, 0.4)",
    },
    {
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      shadow: "rgba(240, 147, 251, 0.4)",
    },
    {
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      shadow: "rgba(79, 172, 254, 0.4)",
    },
    {
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      shadow: "rgba(67, 233, 123, 0.4)",
    },
    {
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      shadow: "rgba(250, 112, 154, 0.4)",
    },
    {
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      shadow: "rgba(168, 237, 234, 0.4)",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ p: 8}}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Diamond
            sx={{
              fontSize: 40,
              background: "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #2C3E50 30%, #34495E 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Jewellery Portfolio
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: "#64748B",
            fontWeight: 400,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Comprehensive overview of your precious jewellery collection and loan portfolio
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} lg={4} key={item.itemType}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: cardColors[index % cardColors.length].gradient,
                color: "white",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                height:"75%",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: `0 20px 40px ${
                    cardColors[index % cardColors.length].shadow
                  }`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                },
              }}
            >
              {/* Card Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    textTransform: "capitalize",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.itemType}
                </Typography>
                <Chip
                  icon={<TrendingUp />}
                  label="Active"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Stats */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: "0.875rem",
                    }}
                  >
                    Total Items
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <CountUp
                      start={0}
                      end={item.totalCount}
                      duration={2}
                      separator=","
                    />
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: "0.875rem",
                    }}
                  >
                    Loan Amount
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <CountUp
                      start={0}
                      end={item.totalLoanAmount}
                      duration={2.5}
                      separator=","
                      decimals={0}
                      prefix="₹"
                    />
                  </Typography>
                </Box>
              </Box>

              {/* Decorative Elements */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  opacity: 0.6,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  opacity: 0.8,
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Summary Footer */}
      {data.length > 0 && (
        <Box
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: "#F8FAFC",
            borderRadius: 3,
            textAlign: "center",
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            Total Categories: <strong>{data.length}</strong> • 
            Last Updated: <strong>{new Date().toLocaleDateString()}</strong>
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default LoanRepayment;