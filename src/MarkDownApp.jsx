import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import "./App.css";

function App() {
  const [rawFileUrl, setRawFileUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMarkdown("");
    try {
      let data = JSON.stringify({
        input: {
          topic: rawFileUrl,
        },
        config: {},
      });
      const response = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "https://8zdhdl5q-8000.inc1.devtunnels.ms/v2/invoke",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: data,
      });

      const content = response.data.output.output.content;
      setMarkdown(content);
    } catch (err) {
      setError(
        "Failed to fetch markdown content. Please make sure the GitHub raw file URL is correct."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="app-container">
      <Typography variant="h3" gutterBottom>
        Markdown Viewer
      </Typography>
      <form onSubmit={handleSubmit} className="url-form">
        <TextField
          fullWidth
          variant="outlined"
          label="Enter Raw File URL"
          placeholder="e.g., https://raw.githubusercontent.com/owner/repo/main/README.md"
          value={rawFileUrl}
          onChange={(e) => setRawFileUrl(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Fetch Markdown"
          )}
        </Button>
      </form>
      {error && (
        <Typography color="error" className="error-message">
          {error}
        </Typography>
      )}
      {markdown && (
        <Paper elevation={3} className="markdown-content">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </Paper>
      )}
    </Container>
  );
}

export default App;
