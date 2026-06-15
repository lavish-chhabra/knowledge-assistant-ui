import { useEffect, useState } from "react";
import api from "./services/api";

import UploadDocument from "./components/UploadDocument";
import DocumentList from "./components/DocumentList";
import ChatWindow from "./components/ChatWindow";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CssBaseline from "@mui/material/CssBaseline";

import {
    createTheme,
    ThemeProvider
} from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function App() {

    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode
                ? "dark"
                : "light"
        }
    });

    const loadDocuments = async () => {

        try {

            setError("");

            const response =
                await api.get("/documents");

            setDocuments(response.data);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to connect to backend."
            );
        }
    };

    useEffect(() => {

        const fetchDocuments = async () => {
            await loadDocuments();
        };

        fetchDocuments();

    }, []);

    return (

        <ThemeProvider theme={theme}>

            <CssBaseline />

            <Container
                maxWidth="lg"
                sx={{
                    mt: 4,
                    mb: 4
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2
                    }}
                >

                    <Typography
                        variant="h3"
                        fontWeight="bold"
                    >
                        Knowledge Assistant
                    </Typography>

                    <IconButton
                        onClick={() =>
                            setDarkMode(
                                previous => !previous
                            )
                        }
                    >
                        {darkMode
                            ? <LightModeIcon />
                            : <DarkModeIcon />}
                    </IconButton>

                </Box>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Upload documents and ask questions using RAG.
                </Typography>

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 3
                    }}
                >

                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Upload Document
                    </Typography>

                    <UploadDocument
                        onUploadSuccess={loadDocuments}
                    />

                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 3
                    }}
                >

                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Uploaded Documents
                    </Typography>

                    <DocumentList
                        documents={documents}
                    />

                </Paper>

                <Divider
                    sx={{ mb: 3 }}
                />

                <Paper
                    elevation={3}
                    sx={{
                        p: 3
                    }}
                >

                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Chat
                    </Typography>

                    <ChatWindow />

                </Paper>

            </Container>

        </ThemeProvider>
    );
}

export default App;