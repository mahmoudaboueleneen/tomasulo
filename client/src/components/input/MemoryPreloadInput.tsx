import React, { useState, useContext, useEffect } from "react";

import { InputContext } from "../../contexts/InputContext";
import { Box, Button, FormControl, TextField, List, ListItem, Typography } from "@mui/material";

const MemoryPreloadInput: React.FC = () => {
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [memoryValue, setMemoryValue] = useState(0);
    const { setPreloadedMemoryLocations, preloadedMemoryLocations } = useContext(InputContext);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAddress(Number(e.target.value));
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMemoryValue(Number(e.target.value));
    };

    const handleAddMemory = () => {
        setPreloadedMemoryLocations((prevState) => [
            ...(prevState || []),
            { address: selectedAddress, value: memoryValue }
        ]);
    };

    const handleRemoveMemory = (address: number) => {
        setPreloadedMemoryLocations((prevState) => prevState?.filter((memory) => memory.address !== address) || []);
    };

    const isMemoryLoaded = (address: number) => {
        return preloadedMemoryLocations?.some((m) => m.address === address);
    };

    useEffect(() => {
        console.log("Preloaded Memory Locations:", preloadedMemoryLocations);
    }, [preloadedMemoryLocations]);

    return (
        <Box>
            <FormControl>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <TextField label="Address" type="number" value={selectedAddress} onChange={handleAddressChange} />
                    <TextField label="Value" type="number" value={memoryValue} onChange={handleValueChange} />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAddMemory}
                        disabled={isMemoryLoaded(selectedAddress)}
                    >
                        Preload Memory Location
                    </Button>
                </Box>
            </FormControl>

            <Box>
                <Typography variant="h6">Preloaded Memory</Typography>
                {preloadedMemoryLocations?.length ? (
                    <List>
                        {preloadedMemoryLocations.map((m, index) => (
                            <ListItem key={index}>
                                {m.address}: {m.value}
                                <Button
                                    sx={{ ml: 2 }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRemoveMemory(m.address)}
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No memory locations currently preloaded.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default MemoryPreloadInput;
