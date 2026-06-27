import { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

function ChatWindow() {

    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    const [sessionId, setSessionId] = useState(() => {

        let existingSessionId =
            localStorage.getItem("sessionId");

        if (!existingSessionId) {

            existingSessionId =
                crypto.randomUUID();

            localStorage.setItem(
                "sessionId",
                existingSessionId
            );
        }

        return existingSessionId;
    });

    const askQuestion = async () => {

        if (!question.trim()) {
            return;
        }

        const currentQuestion = question;

        setQuestion("");
        setLoading(true);

        const assistantMessageIndex =
            messages.length + 1;

        setMessages(previous => [

            ...previous,

            {
                role: "user",
                content: currentQuestion
            },

            {
                role: "assistant",
                content: ""
            }
        ]);

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/rag/stream`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sessionId,
                        question: currentQuestion
                    })
                }
            );

            const reader =
                response.body.getReader();

            const decoder =
                new TextDecoder();

            let answer = "";

            while (true) {

                const { done, value } =
                    await reader.read();

                if (done) {
                    break;
                }

                const token =
                    decoder.decode(value);

                answer += token;

                setMessages(previous => {

                    const updated =
                        [...previous];

                    updated[
                        assistantMessageIndex
                        ] = {

                        ...updated[
                            assistantMessageIndex
                            ],

                        content: answer
                    };

                    return updated;
                });
            }

        } catch (error) {

            console.error(error);

            setMessages(previous => [

                ...previous,

                {
                    role: "assistant",
                    content:
                        "Failed to get response from backend."
                }
            ]);

        } finally {

            setLoading(false);
        }
    };

    return (

        <Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3
                }}
            >

                <TextField
                    fullWidth
                    label="Ask a question"
                    value={question}
                    onChange={(event) =>
                        setQuestion(event.target.value)
                    }
                    onKeyDown={(event) => {

                        if (
                            event.key === "Enter"
                            && !loading
                        ) {
                            askQuestion();
                        }
                    }}
                />

                <Button
                    variant="contained"
                    onClick={askQuestion}
                    disabled={loading}
                >
                    Ask
                </Button>

                <Button
                    color="secondary"
                    disabled={loading}
                    onClick={() => {

                        const newSessionId =
                            crypto.randomUUID();

                        localStorage.setItem(
                            "sessionId",
                            newSessionId
                        );

                        setSessionId(newSessionId);
                        setMessages([]);
                    }}
                >
                    New Chat
                </Button>

            </Box>

            {loading && (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 2
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            <Box
                sx={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    pr: 1
                }}
            >

                {messages.map((message, index) => (

                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent:
                                message.role === "user"
                                    ? "flex-end"
                                    : "flex-start",
                            mb: 2
                        }}
                    >

                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                maxWidth: "75%"
                            }}
                        >

                            <Typography variant="body1">
                                {message.content}
                            </Typography>

                            {message.sources &&
                                message.sources.length > 0 && (

                                    <Box sx={{ mt: 2 }}>

                                        <Typography
                                            variant="caption"
                                        >
                                            Sources
                                        </Typography>

                                        <Box
                                            sx={{
                                                mt: 1,
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 1
                                            }}
                                        >

                                            {message.sources.map(
                                                (
                                                    source,
                                                    sourceIndex
                                                ) => (

                                                    <Chip
                                                        key={sourceIndex}
                                                        label={`📄 ${source.fileName}`}
                                                        size="small"
                                                    />
                                                ))}

                                        </Box>

                                    </Box>
                                )}

                        </Paper>

                    </Box>
                ))}

                <div ref={messagesEndRef} />

            </Box>

        </Box>
    );
}

export default ChatWindow;