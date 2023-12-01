import React, { useState, useContext, useEffect } from "react";

import AvailableRegisters from "../../constants/AvailableRegisters";
import { InputContext } from "../../contexts/InputContext";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    List,
    ListItem,
    Typography
} from "@mui/material";

const RegisterPreloadInput: React.FC = () => {
    const [selectedRegister, setSelectedRegister] = useState(AvailableRegisters[0]);
    const [registerValue, setRegisterValue] = useState(0);
    const { setPreloadedRegisters, preloadedRegisters } = useContext(InputContext);

    const handleRegisterChange = (event: SelectChangeEvent<string>) => {
        setSelectedRegister(event.target.value as string);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterValue(Number(e.target.value));
    };

    const handleAddRegister = () => {
        setPreloadedRegisters((prevState) => [...(prevState || []), { name: selectedRegister, value: registerValue }]);
    };

    const handleRemoveRegister = (name: string) => {
        setPreloadedRegisters((prevState) => prevState?.filter((register) => register.name !== name) || []);
    };

    const isRegisterLoaded = (register: string) => {
        return preloadedRegisters?.some((r) => r.name === register);
    };

    useEffect(() => {
        console.log("Preloaded Registers:", preloadedRegisters);
    }, [preloadedRegisters]);

    return (
        <Box>
            <FormControl>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box>
                        <InputLabel id="register-select-label">Register</InputLabel>
                        <Select
                            label="Register"
                            labelId="register-select-label"
                            value={selectedRegister}
                            onChange={handleRegisterChange}
                        >
                            {AvailableRegisters.map((register) => (
                                <MenuItem key={register} value={register}>
                                    {register}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <TextField label="Value" type="number" value={registerValue} onChange={handleValueChange} />

                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAddRegister}
                        disabled={isRegisterLoaded(selectedRegister)}
                    >
                        Preload Register
                    </Button>
                </Box>
            </FormControl>

            <Box>
                <Typography variant="h6">Preloaded Registers</Typography>
                {preloadedRegisters?.length ? (
                    <List>
                        {preloadedRegisters.map((r, index) => (
                            <ListItem key={index}>
                                {r.name}: {r.value}
                                <Button
                                    sx={{ ml: 2 }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRemoveRegister(r.name)}
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No registers currently preloaded.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default RegisterPreloadInput;
