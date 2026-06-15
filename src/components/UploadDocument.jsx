import { useState } from "react";
import api from "../services/api";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function UploadDocument({ onUploadSuccess }) {

    const [selectedFile, setSelectedFile] =
        useState(null);

    const uploadFile = async () => {

        if (!selectedFile) {
            alert("Please select a file");
            return;
        }

        try {

            const formData = new FormData();

            formData.append(
                "file",
                selectedFile
            );

            await api.post(
                "/documents/upload",
                formData
            );

            onUploadSuccess();

            setSelectedFile(null);

        } catch (error) {

            console.error(error);

            alert("Upload failed");
        }
    };

    return (

        <Stack spacing={2}>

            <Button
                variant="outlined"
                component="label"
            >
                Select PDF

                <input
                    hidden
                    type="file"
                    accept=".pdf"
                    onChange={(event) =>
                        setSelectedFile(
                            event.target.files[0]
                        )
                    }
                />
            </Button>

            {selectedFile && (

                <Typography>

                    Selected:
                    {" "}
                    {selectedFile.name}

                </Typography>
            )}

            <Button
                variant="contained"
                onClick={uploadFile}
            >
                Upload
            </Button>

        </Stack>
    );
}

export default UploadDocument;