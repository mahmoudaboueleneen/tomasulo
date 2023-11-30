import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ReusableTable from "./ReusableTable";
import { useEffect, useState } from "react";
import axios from "axios";

const Output = () => {
    const [tomasuloInstances, setTomasuloInstances] = useState([]);
    const [cycleNumber, setCycleNumber] = useState(0);

    useEffect(() => {
        const fetchTomasuloData = async () => {
            await axios.get("/api/input");
        };

        // fetchTomasuloData();
    }, []);

    const incrementCycle = () => {
        setCycleNumber((prevCycleNumber) => prevCycleNumber + 1);
    };

    const decrementCycle = () => {
        setCycleNumber((prevCycleNumber) => (prevCycleNumber > 0 ? prevCycleNumber - 1 : 0));
    };

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <IconButton onClick={decrementCycle} disabled={cycleNumber === 0}>
                    <ArrowBackIosIcon />
                </IconButton>

                <Typography variant="h5" component={"h1"}>{`Cycle Number ${cycleNumber}`}</Typography>

                <IconButton onClick={incrementCycle}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", pt: 5 }}>
                <Box sx={{ display: "flex", gap: 5 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box>
                            <Typography variant="body1">AddSub</Typography>
                            <ReusableTable
                                columns={["Busy", "Op", "Vj", "Vk", "Qj", "Qk", "A"]}
                                rows={[
                                    { Busy: 1, Op: "ADD.D", Vj: 0, Vk: 0, Qj: 0, Qk: 0, A: 0 },
                                    { Busy: 0, Op: "SUB.D", Vj: 0, Vk: 0, Qj: 0, Qk: 0, A: 0 }
                                ]}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1">MulDiv</Typography>
                            <ReusableTable
                                columns={["Busy", "Op", "Vj", "Vk", "Qj", "Qk", "A"]}
                                rows={[
                                    { Busy: 1, Op: "MUL.D", Vj: 0, Vk: 0, Qj: 0, Qk: 0, A: 0 },
                                    { Busy: 0, Op: "DIV.D", Vj: 0, Vk: 0, Qj: 0, Qk: 0, A: 0 }
                                ]}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1">Load</Typography>
                            <ReusableTable
                                columns={["Busy", "Address"]}
                                rows={[
                                    { Busy: 1, Address: 0 },
                                    { Busy: 0, Address: 0 }
                                ]}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1">Store</Typography>
                            <ReusableTable
                                columns={["Busy", "Address", "V", "Q"]}
                                rows={[
                                    { Busy: 1, Address: 0, V: 0, Q: 0 },
                                    { Busy: 0, Address: 0, V: 0, Q: 0 }
                                ]}
                            />
                        </Box>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="body1">Queue</Typography>
                        <ReusableTable
                            columns={["Instruction"]}
                            rows={[
                                { Instruction: "L.D F6, 34(R2)" },
                                { Instruction: "L.D F2, 45(R3)" },
                                { Instruction: "MUL.D F0, F2, F4" },
                                { Instruction: "SUB.D F8, F6, F2" },
                                { Instruction: "DIV.D F10, F0, F6" },
                                { Instruction: "ADD.D F6, F8, F2" }
                            ]}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body1">Reg. File</Typography>
                        <ReusableTable
                            columns={["Register", "Qi", "Content"]}
                            rows={[
                                { Register: "R0", Qi: 0, Content: 0 },
                                { Register: "F0", Qi: 0, Content: 0 }
                            ]}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body1">Data Cache</Typography>
                        <ReusableTable
                            columns={["Address", "Value"]}
                            rows={[
                                { Address: 0, Value: 0 },
                                { Address: 1, Value: 0 }
                            ]}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Output;
