import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ReusableTable from "./ReusableTable";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { InputContext } from "../../contexts/InputContext";
import { parseInstructions } from "../../utils/Parsing";

const Output = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [tomasuloInstances, setTomasuloInstances] = useState<any>([]);
    const [cycleNumber, setCycleNumber] = useState(0);

    const {
        instructionLatencies,
        bufferSizes,
        reservationStationsSizes,
        instructions,
        preloadedRegisters,
        preloadedMemoryLocations
    } = useContext(InputContext);

    useEffect(() => {
        const fetchTomasuloData = async () => {
            const parsedInstructions = await parseInstructions(instructions);

            const response = await axios.post("http://localhost:3000/api/v1/tomasulo", {
                instructionLatencies,
                bufferSizes,
                reservationStationsSizes,
                parsedInstructions,
                preloadedRegisters,
                preloadedMemoryLocations
            });
            setTomasuloInstances(response.data.tomasuloInstances);

            setIsLoading(false);
        };
        fetchTomasuloData();
    }, []);

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    decrementCycle();
                    break;
                case "ArrowRight":
                    incrementCycle();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const incrementCycle = () => {
        setCycleNumber((prevCycleNumber) =>
            prevCycleNumber + 1 < tomasuloInstances.length ? prevCycleNumber + 1 : prevCycleNumber
        );
    };

    const decrementCycle = () => {
        setCycleNumber((prevCycleNumber) => (prevCycleNumber > 0 ? prevCycleNumber - 1 : 0));
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    const currentTomasuloInstance = tomasuloInstances[cycleNumber];
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <IconButton onClick={decrementCycle} disabled={cycleNumber === 0}>
                    <ArrowBackIosIcon />
                </IconButton>

                <Typography variant="h5" component={"h1"}>{`Cycle Number ${cycleNumber}`}</Typography>

                <IconButton onClick={incrementCycle} disabled={cycleNumber === tomasuloInstances.length - 1}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", pt: 5 }}>
                <Box sx={{ display: "flex", gap: 5 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box>
                            <Typography variant="body1">AddSub</Typography>
                            <ReusableTable
                                columns={["Cycles Left", "Tag", "Busy", "Op", "Vj", "Vk", "Qj", "Qk", "A"]}
                                rows={currentTomasuloInstance.addSubReservationStations.map((station: any) => ({
                                    "Cycles Left": station.cyclesLeft,
                                    Tag: station.tag,
                                    Busy: station.busy,
                                    Op: station.op,
                                    Vj: station.vj,
                                    Vk: station.vk,
                                    Qj: station.qj || 0,
                                    Qk: station.qk || 0,
                                    A: station.A
                                }))}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1">MulDiv</Typography>
                            <ReusableTable
                                columns={["Cycles Left", "Tag", "Busy", "Op", "Vj", "Vk", "Qj", "Qk", "A"]}
                                rows={currentTomasuloInstance.mulDivReservationStations.map((station: any) => ({
                                    "Cycles Left": station.cyclesLeft,
                                    Tag: station.tag,
                                    Busy: station.busy,
                                    Op: station.op,
                                    Vj: station.vj,
                                    Vk: station.vk,
                                    Qj: station.qj || 0,
                                    Qk: station.qk || 0,
                                    A: station.A
                                }))}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1">Load</Typography>
                            <ReusableTable
                                columns={["Cycles Left", "Tag", "Busy", "Address"]}
                                rows={currentTomasuloInstance.loadBuffers.map((buffer: any) => ({
                                    "Cycles Left": buffer.cyclesLeft,
                                    Tag: buffer.tag,
                                    Busy: buffer.busy,
                                    Address: buffer.address
                                }))}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1">Store</Typography>
                            <ReusableTable
                                columns={["Cycles Left", "Tag", "Busy", "Address", "V", "Q"]}
                                rows={currentTomasuloInstance.storeBuffers.map((buffer: any) => ({
                                    "Cycles Left": buffer.cyclesLeft,
                                    Tag: buffer.tag,
                                    Busy: buffer.busy,
                                    Address: buffer.address,
                                    V: buffer.v,
                                    Q: buffer.q || 0
                                }))}
                            />
                        </Box>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="body1">Queue</Typography>
                        <ReusableTable
                            columns={["Instruction"]}
                            rows={currentTomasuloInstance.instructionQueue.instructions.map((instruction: any) => ({
                                Instruction: instruction
                            }))}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body1">Int Registers</Typography>
                        <ReusableTable
                            columns={["Register", "Qi", "Content"]}
                            rows={currentTomasuloInstance.registerFile
                                .filter((register: any) => register.name.startsWith("R"))
                                .map(({ name, qi, value }: any) => ({
                                    Register: name,
                                    Qi: qi || 0,
                                    Content: value
                                }))}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body1">FP Registers</Typography>
                        <ReusableTable
                            columns={["Register", "Qi", "Content"]}
                            rows={currentTomasuloInstance.registerFile
                                .filter((register: any) => register.name.startsWith("F"))
                                .map(({ name, qi, value }: any) => ({
                                    Register: name,
                                    Qi: qi || 0,
                                    Content: value
                                }))}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body1">Data Cache</Typography>
                        <ReusableTable
                            columns={["Address", "Value"]}
                            rows={currentTomasuloInstance.dataCache.map(({ address, value }: any) => ({
                                Address: address,
                                Value: value
                            }))}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Output;
