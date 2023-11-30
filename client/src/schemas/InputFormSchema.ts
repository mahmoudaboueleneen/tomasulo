import { z } from "zod";

const InputFormSchema = z.object({
    FPAddLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    FPSubtractLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    FPMultiplyLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    FPDivideLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    IntSubtractLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    LoadBufferSize: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    StoreBufferSize: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    AddSubtractReservationStationSize: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
    MultiplyDivideReservationStationSize: z.preprocess(
        (value) => parseInt(value as string),
        z.number().positive().int()
    )
});

export default InputFormSchema;
