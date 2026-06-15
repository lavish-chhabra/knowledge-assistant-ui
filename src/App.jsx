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

function App() {

    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState("");

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

        <Container
            maxWidth="lg"
            sx={{ mt: 4, mb: 4 }}
        >

            <Typography
                variant="h3"
                gutterBottom
                fontWeight="bold"
            >
                Knowledge Assistant
            </Typography>

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
                sx={{ p: 3, mb: 3 }}
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
                sx={{ p: 3, mb: 3 }}
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

            <Divider sx={{ mb: 3 }} />

            <Paper
                elevation={3}
                sx={{ p: 3 }}
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
    );
}

export default App;