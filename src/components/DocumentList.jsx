import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function DocumentList({ documents }) {

    return (

        <TableContainer
            component={Paper}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            File Name
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {documents.map(document => (

                        <TableRow
                            key={document.id}
                        >

                            <TableCell>
                                {document.fileName}
                            </TableCell>

                        </TableRow>
                    ))}

                </TableBody>

            </Table>

        </TableContainer>
    );
}

export default DocumentList;